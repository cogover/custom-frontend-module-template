import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { ErrorApiResponse } from 'src/apis/apiBase';
import { defaultQueryClient } from './helper/queryClient';
declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError<ErrorApiResponse>;
    }
}

interface ReactQueryProviderProps {
    children: React.ReactNode;
    queryClient?: QueryClient;
}
export default function ReactQueryProvider({ children, queryClient = defaultQueryClient }: ReactQueryProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
            {children}
        </QueryClientProvider>
    );
}
