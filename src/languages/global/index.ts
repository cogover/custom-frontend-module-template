import i18nsDefault, { TFunction, TOptions } from 'i18next';
import { isString } from 'lodash';
import objectPath from 'object-path';
import { useLibrary } from '@cogover/client-sdk';
import { useEffect } from 'react';
import { useTranslation as useTranslationDefault } from 'react-i18next';
// Import này cũng khởi tạo i18n ngay khi dùng API dịch, kể cả component expose không đi qua `App`.
import { DEFAULT_LANG } from 'src/languages/i18n';

const i18n = i18nsDefault;

/**
 * Đồng bộ ngôn ngữ i18n theo `locale` nền tảng Cogover cấp qua `useLibrary()`; chưa có thì dùng
 * `DEFAULT_LANG`. Trả về ngôn ngữ đang dùng.
 */
const useSyncDisplayLanguage = () => {
    const language = useLibrary().locale || DEFAULT_LANG;

    useEffect(() => {
        if (i18n.language !== language) {
            void i18n.changeLanguage(language);
        }
    }, [language]);

    return language;
};

const useTranslation: typeof useTranslationDefault = (ns, options) => {
    const language = useSyncDisplayLanguage();

    return useTranslationDefault(ns, { lng: language, ...options });
};

const defaultT = ((key: string, options: TOptions) => {
    try {
        const value = i18n.t(key, { ...options, returnDetails: true });
        const responseText = objectPath.get(value, 'res.res') as string;
        const i18nKey = objectPath.get(value, 'exactUsedKey') as string;
        const ns = objectPath.get(value, 'usedNS') as string;

        if (responseText === i18nKey) {
            return `${ns}:${i18nKey}`;
        }

        if (isString(responseText)) {
            return responseText;
        }

        return i18n.t(i18nKey, options);
    } catch (err) {
        console.error(err);
        return key;
    }
}) as TFunction;

const t = process.env.NODE_ENV === 'test' ? i18n.t : defaultT;

export { i18n, t, useSyncDisplayLanguage, useTranslation };
