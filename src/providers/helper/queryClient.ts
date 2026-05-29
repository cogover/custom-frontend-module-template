import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiErrorHandler from 'src/apis/apiErrorHandler';

export const defaultQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 phút
            retry: (failureCount, error: AxiosError) => {
                if (error.response?.status === 403) {
                    //lỗi do server trả về vì token không hợp lệ: ko retry
                    return false;
                }
                return failureCount < 2; // nếu lỗi mạng hoặc lỗi khác thì retry 5 lần
            },
        },
    },
    mutationCache: new MutationCache({
        onError(error) {
            apiErrorHandler(error);
        },
    }),
    queryCache: new QueryCache({
        onError(error) {
            apiErrorHandler(error);
        },
    }),
});
