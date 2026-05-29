import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_LANG, SupportedLanguagesKeys } from 'src/languages/i18n';
import { LoginUrlParams, loginUrl } from 'src/router/routeMap';
import { useDisplayLanguage } from 'src/store/commonSettingsSlice';
import { DEFAULT_CONTINUE_URL } from 'src/utils/appUtils';

export default function useGetLoginUrl() {
    const [searchParams] = useSearchParams();
    const accountLanguage = useDisplayLanguage();

    const getLoginUrl = useCallback(
        (
            params: LoginUrlParams = {
                continue: DEFAULT_CONTINUE_URL,
            },
        ) => {
            return loginUrl({
                ...params,
                lang: (accountLanguage ?? searchParams.get('lang') ?? DEFAULT_LANG) as SupportedLanguagesKeys,
            });
        },
        [accountLanguage, searchParams],
    );

    return { getLoginUrl };
}
