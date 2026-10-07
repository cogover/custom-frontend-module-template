import http, { SuccessResponse } from 'src/apis/apiBase';

const URI = '/api/v1/accounts';

export const accountURI = {
    logout: `${URI}/logout`,
};

export const accountApi = {
    /** Đăng xuất phiên của workspace hiện tại (giống Cogover). */
    logout() {
        return http.post<SuccessResponse<unknown>>(accountURI.logout);
    },
};

export const accountApiKeys = {
    all: ['accounts'] as const,
    logout: () => [...accountApiKeys.all, 'logout'] as const,
};
