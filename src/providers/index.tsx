import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import ThemeProvider from './ThemeProvider.tsx';
import { AppSlugProvider } from './AppSlugProvider';

export default function MainProvider({ children }: PropsWithChildren) {
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                <ThemeProvider>
                    <AppSlugProvider>{children}</AppSlugProvider>
                </ThemeProvider>
            </ReactQueryProvider>
        </ReduxProvider>
    );
}
