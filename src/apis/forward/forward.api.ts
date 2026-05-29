import { useMutation } from '@tanstack/react-query';
import http, { SuccessResponse } from '../apiBase';
const forwardApiUri = {
    forwardAccount: '/api/v1/accountService',
};
const forwardApi = {
    forwardAccount<R>(data: unknown) {
        return http.post<SuccessResponse<R>>(forwardApiUri.forwardAccount, data);
    },
};

export const forwardApiKeys = {
    FORWARD_ACCOUNT: 'FORWARD_ACCOUNT',
};

export const useForwardAccountApi = <R>() => {
    return useMutation({
        mutationKey: [forwardApiKeys.FORWARD_ACCOUNT],
        mutationFn: async (body: unknown) => forwardApi.forwardAccount<R>(body),
    });
};
