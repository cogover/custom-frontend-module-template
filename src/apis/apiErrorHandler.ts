import { AxiosError, HttpStatusCode } from 'axios';
import { minimatch } from 'minimatch';

import { appStore } from 'src/store';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { ErrorApiResponse } from './apiBase';
import { toastCommonError, toastTooManyRequest } from 'src/utils/toastUtils';

export const handledErrorStatus = [
    HttpStatusCode.InternalServerError,
    HttpStatusCode.Unauthorized,
    HttpStatusCode.TooManyRequests,
];

interface ErrorRule {
    url: string;
    handlers: {
        [key in HttpStatusCode]?: (error: AxiosError<ErrorApiResponse>) => void;
    };
}

const rules: ErrorRule[] = [
    {
        url: '**/**',
        handlers: {
            [HttpStatusCode.InternalServerError]: () => {
                toastCommonError();
            },
            [HttpStatusCode.Unauthorized]: () => {
                appStore.dispatch(
                    setCommonSettingState({
                        account: null,
                        tokenID: '',
                    }),
                );
            },
            [HttpStatusCode.TooManyRequests]: (error) => {
                const data = error.response?.data as unknown as { data: { blockedTimeRemaining: number } };
                const remainTime = data?.data?.blockedTimeRemaining ?? null;

                toastTooManyRequest({ remainTime });
            },
        },
    },
];

const apiErrorHandler = (error: AxiosError<ErrorApiResponse>) => {
    if (!error.response) return;
    const url = error.response.config.url ?? '';
    const status = error.response.status as HttpStatusCode;

    const matchedRule = rules.find((rule) => {
        return minimatch(url, rule.url) && rule.handlers[status];
    });
    if (!matchedRule) {
        return;
    }

    const handler = matchedRule.handlers[status];
    if (handler) {
        handler(error);
    }
};

export default apiErrorHandler;
