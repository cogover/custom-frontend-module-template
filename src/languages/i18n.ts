import i18n, { BackendModule, Module, Resource } from 'i18next';
import { isPlainObject, merge } from 'lodash';
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
 * Bản dịch của module nằm trong `src/languages/locales/<lng>/<ns>.json` (thêm ngôn ngữ/namespace = thêm file JSON).
 * Mỗi namespace còn được gộp với bản dịch nền tảng Cogover tại `/static/locales/<lng>/<ns>.json`:
 * bản dịch nền tảng làm nền, key trong repo ưu tiên. Namespace không có trong repo (`common`, `object`…)
 * dùng hoàn toàn bản dịch nền tảng, tải khi được gọi lần đầu (`t('<ns>:<key>')`).
 */
const localeModules = import.meta.glob<{ default: Record<string, unknown> }>('./locales/**/*.json', {
    eager: true,
});

const localResources: Resource = {};
for (const filePath in localeModules) {
    const matched = /\.\/locales\/([^/]+)\/([^/]+)\.json$/.exec(filePath);
    if (!matched) continue;
    const [, lng, ns] = matched;
    localResources[lng] = localResources[lng] ?? {};
    localResources[lng][ns] = localeModules[filePath].default;
}

const STATIC_LOCALES_PATH = '/static/locales';

let buildTimePromise: Promise<string> | undefined;

/** Phiên bản bản dịch nền tảng, đọc một lần để làm tham số cache-bust; lỗi thì để rỗng. */
function getStaticBuildTime() {
    buildTimePromise ??= fetch(`${STATIC_LOCALES_PATH}/i18n-meta.json?v=${Date.now()}`)
        .then((res) => res.json() as Promise<unknown>)
        .then((meta) => {
            const buildTime: unknown = isPlainObject(meta) ? (meta as { buildTime?: unknown }).buildTime : undefined;
            return buildTime === undefined || buildTime === null ? '' : String(buildTime);
        })
        .catch(() => '');
    return buildTimePromise;
}

/** Tải bản dịch nền tảng; không có file, lỗi mạng hoặc JSON hỏng đều coi là rỗng. */
async function loadStaticBundle(lng: string, ns: string): Promise<Record<string, unknown>> {
    try {
        const buildTime = await getStaticBuildTime();
        const res = await fetch(`${STATIC_LOCALES_PATH}/${lng}/${ns}.json?v=${encodeURIComponent(buildTime)}`);
        if (!res.ok) return {};
        const data: unknown = await res.json();
        return isPlainObject(data) ? (data as Record<string, unknown>) : {};
    } catch {
        return {};
    }
}

const staticAndLocalBackend: BackendModule = {
    type: 'backend',
    init: () => undefined,
    read(lng, ns, callback) {
        void loadStaticBundle(lng, ns).then((staticBundle) => {
            callback(null, merge({}, staticBundle, localResources[lng]?.[ns]));
        });
    },
};

/**
 * Namespace có trong repo được nạp sẵn để hiện chữ ngay; khi ngôn ngữ được dùng lần đầu thì tải thêm
 * bản dịch nền tảng và gộp lại (repo vẫn ưu tiên).
 */
const mergedLanguages = new Set<string>();
i18n.on('languageChanged', () => {
    for (const lng of i18n.languages ?? []) {
        if (mergedLanguages.has(lng) || !localResources[lng]) continue;
        mergedLanguages.add(lng);
        // Truyền mảng để i18next không tải lại cả ngôn ngữ dự phòng (đã gộp riêng).
        void i18n.reloadResources([lng], Object.keys(localResources[lng]));
    }
});

i18n.use(lazyLoadNamespaceProcessor as Module);

void i18n
    .use(staticAndLocalBackend)
    .use(initReactI18next)
    .init({
        resources: localResources,
        partialBundledLanguages: true,
        lng: DEFAULT_LANG,
        fallbackLng: {
            default: ['en-US'],
        },
        defaultNS,
        load: 'currentOnly',
        ns: [defaultNS],
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        react: {
            useSuspense: false,
            // Render lại khi namespace tải xong để chữ của bản dịch nền tảng hiện ngay.
            bindI18n: 'languageChanged loaded',
        },
        postProcess: [I18N_PROCESSORS.LAZY_LOAD_NAMESPACE],
    });
