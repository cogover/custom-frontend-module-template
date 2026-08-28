import axios, { AxiosError } from 'axios';
import { getXsrfToken } from 'src/utils/authUtils';
import { DEVELOPMENT_MODE } from 'src/utils/constant/app';
import { uuidv4 } from 'src/utils/appUtils';
import { getRetryDelay, RetryRequestConfig, shouldRetryRequest } from './httpRetry';

export type { ErrorApiResponse, SuccessResponse, SuccessServiceResponse } from 'src/utils/types/api.type';

const requestSourceId = uuidv4();
let requestId = 0;

const http = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

http.interceptors.request.use((config) => {
    window.sessionStorage.setItem(
        'requested',
        [window.sessionStorage.getItem('requested'), JSON.stringify(config.url)].filter(Boolean).join(','),
    );

    config.headers.set('X-CSRF-TOKEN', getXsrfToken());
    config.headers.set('X-Req-Id', requestId++);
    config.headers.set('X-Req-From', requestSourceId);

    const apps = window.appStore?.getState().commonSettings.apps;
    if (apps?.length) {
        const appSlug = window.location.pathname.split('/').filter(Boolean)[0];
        const currentApp = apps.find((app) => app.slug === appSlug) ?? apps[0];
        config.headers.set('X-App-Slug', currentApp.slug);
    }

    const retryConfig = config as RetryRequestConfig;
    retryConfig.retriedCount = retryConfig.retriedCount ?? 0;
    return config;
});

http.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetryRequestConfig | undefined;
    if (
        DEVELOPMENT_MODE !== 'production' ||
        !config ||
        config.disableRetry ||
        config.signal?.aborted ||
        !shouldRetryRequest(error)
    ) {
        return await Promise.reject(error);
    }

    const retriedCount = (config.retriedCount ?? 0) + 1;
    config.retriedCount = retriedCount;
    await new Promise((resolve) => setTimeout(resolve, getRetryDelay(retriedCount)));
    return await http(config);
});

export default http;
