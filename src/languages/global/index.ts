import i18nsDefault, { TFunction, TOptions } from 'i18next';
import { isString } from 'lodash';
import objectPath from 'object-path';
import { useCallback, useContext, useEffect, useSyncExternalStore } from 'react';
import { useTranslation as useTranslationDefault } from 'react-i18next';
import { ReactReduxContext } from 'react-redux';
// Import này cũng khởi tạo i18n ngay khi dùng API dịch, kể cả component expose không đi qua `App`.
import { DEFAULT_LANG } from 'src/languages/i18n';
import type { RootState } from 'src/store';

const i18n = i18nsDefault;

/**
 * Ngôn ngữ hiển thị trong Redux `commonSettings` của nền tảng Cogover. Có store mà chưa có tài khoản
 * thì dùng `DEFAULT_LANG`; không có Redux Provider (vd test, nơi nhúng không có store) thì giữ ngôn ngữ
 * hiện tại của i18n, không báo lỗi.
 */
const useDisplayLanguageSafe = () => {
    const store = useContext(ReactReduxContext)?.store;
    const subscribe = useCallback(
        (onChange: () => void) => (store ? store.subscribe(onChange) : () => undefined),
        [store],
    );
    const language = useSyncExternalStore(subscribe, () =>
        store ? (store.getState() as RootState).commonSettings?.workspaceAccount?.language ?? DEFAULT_LANG : undefined,
    );
    return language ?? (i18n.language || DEFAULT_LANG);
};

/**
 * Đồng bộ ngôn ngữ i18n theo ngôn ngữ hiển thị của nền tảng Cogover (Redux `commonSettings`);
 * standalone chưa có tài khoản thì dùng `DEFAULT_LANG`. Trả về ngôn ngữ đang dùng.
 */
const useSyncDisplayLanguage = () => {
    const language = useDisplayLanguageSafe();

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
