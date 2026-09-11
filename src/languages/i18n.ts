import i18n, { Module, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18N_PROCESSORS } from './processors';
import lazyLoadNamespaceProcessor from './processors/lazyLoadNamespace';

export const locales = {
    'en-US': 'English (US)',
    'vi-VN': 'Tiếng Việt',
} as const;
export type LocaleKeys = keyof typeof locales;

export const supportedLanguages = Object.keys(locales);

export const DEFAULT_LANG = 'en-US';

export type SupportedLanguagesKeys = keyof typeof locales;

export enum I18nNS {
    APP = 'app',
    COMMON = 'common',
}

export const defaultNS = I18nNS.APP;
export const namespaces = Object.values(I18nNS);

/**
 * Bản dịch được đóng gói ngay trong dự án, không tải từ kho bản dịch bên ngoài.
 *
 * Mỗi file `src/languages/locales/<lng>/<ns>.json` sẽ tự động trở thành resource của
 * namespace `<ns>` cho ngôn ngữ `<lng>`. Thêm ngôn ngữ/namespace = thêm file JSON tương ứng.
 */
const localeModules = import.meta.glob<{ default: Record<string, unknown> }>('./locales/**/*.json', {
    eager: true,
});

const resources: Resource = {};
for (const filePath in localeModules) {
    const matched = /\.\/locales\/([^/]+)\/([^/]+)\.json$/.exec(filePath);
    if (!matched) continue;
    const [, lng, ns] = matched;
    resources[lng] = resources[lng] ?? {};
    resources[lng][ns] = localeModules[filePath].default;
}

i18n.use(lazyLoadNamespaceProcessor as Module);

void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANG,
    fallbackLng: {
        default: ['en-US'],
    },
    defaultNS,
    load: 'currentOnly',
    ns: namespaces,
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
    react: {
        useSuspense: false,
    },
    postProcess: [I18N_PROCESSORS.LAZY_LOAD_NAMESPACE],
});
