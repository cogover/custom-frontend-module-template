import { useMutation } from '@tanstack/react-query';
import http from '../apiBase';

const uri = '/api/v1/accounts';
export const accountUri = {
    logout: `${uri}/logout`,
};

const accountApi = {
    logout: async () => {
        return http.post(accountUri.logout);
    },
};

export const accountApiKeys = {
    LOGOUT: 'LOGOUT',
};

export const useLogout = () => {
    return useMutation({
        mutationKey: [accountApiKeys.LOGOUT],
        mutationFn: accountApi.logout,
    });
};
