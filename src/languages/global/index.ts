import i18nsDefault, { TFunction, TOptions } from 'i18next';
import { isString } from 'lodash';
import objectPath from 'object-path';
import { useTranslation as useTranslationDefault } from 'react-i18next';

const i18n = i18nsDefault;

const useTranslation = useTranslationDefault;

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

export { i18n, t, useTranslation };
