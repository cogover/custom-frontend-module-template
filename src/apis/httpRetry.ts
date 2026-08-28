import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface RetryRequestConfig extends InternalAxiosRequestConfig {
    disableRetry?: boolean;
    retriedCount?: number;
}

export function shouldRetryRequest(error: AxiosError) {
    const config = error.config as RetryRequestConfig | undefined;
    if ((config?.retriedCount ?? 0) >= 4) return false;

    const status = error.response?.status;
    if (!status) return true;

    return status === 408 || (status >= 500 && status <= 599);
}

export function getRetryDelay(retriedCount: number) {
    return Math.min(250 * 2 ** retriedCount, 4000);
}
