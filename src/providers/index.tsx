import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import ThemeProvider from './ThemeProvider.tsx';
import { AppSlugProvider } from './AppSlugProvider';
import ClientSdkProvider from './ClientSdkProvider';

export default function MainProvider({ children }: PropsWithChildren) {
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                <ThemeProvider>
                    <ClientSdkProvider>
                        <AppSlugProvider>{children}</AppSlugProvider>
                    </ClientSdkProvider>
                </ThemeProvider>
            </ReactQueryProvider>
        </ReduxProvider>
    );
}
