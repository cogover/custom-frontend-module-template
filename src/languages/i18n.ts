import i18n, { Module } from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import FsBackend from 'i18next-fs-backend/cjs';
import HttpBackend from 'i18next-http-backend/cjs';
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
    ACCOUNT_WORKSPACE = 'account_ws',
    DEPARTMENT = 'department',
    OBJECT = 'object',
    DATA_FIELD = 'data_field',
    IMPORT = 'import',
    EXPORT = 'export',
    WORKFLOW = 'workflow',
    MULTILINGUAL = 'multilingual',
    LAYOUT_OBJECT = 'layout_object',
    FILTER = 'filter',
    DATA_SECURITY_RULE = 'data_security_rule',
    WORKFLOW_RESOURCE = 'workflow_resource',
    FUNCTIONAL_DELEGATION = 'functional_delegation',
    WORKFLOW_GATEWAY = 'workflow_gateway',
    DASHBOARD = 'dashboard',
    WORKFLOW_USER_TASK = 'workflow_user_task',
    SITE_BUILDER = 'site_builder',
    WORKFLOW_HTTP_REQUEST = 'workflow_http_request',
    BUTTON_AND_LINK = 'button_and_link',
    SEND_EMAIL = 'send_email',
    NOTIFICATION = 'notification',
    APP_MANAGEMENT = 'app_management',
    WORKFLOW_END_USER = 'workflow_end_user',
    SUBSCRIPTION = 'subscription',
}

export const defaultNS = I18nNS.APP;
export const namespaces = Object.values(I18nNS);

i18n.use(lazyLoadNamespaceProcessor as Module);

void i18n
    .use(ChainedBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: {
            default: ['en-US'],
        },
        defaultNS,
        // ns: namespaces,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        backend: {
            backends: [HttpBackend, FsBackend],
            backendOptions: [
                {
                    //https://asia-1.dev.cogover.net/static/locales/en/dashboard.json
                    loadPath: '/static/locales/{{lng}}/{{ns}}.json',
                },
            ],
        },
        react: {
            useSuspense: false,
        },
        postProcess: [I18N_PROCESSORS.LAZY_LOAD_NAMESPACE],
    });
