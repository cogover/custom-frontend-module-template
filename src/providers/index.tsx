import { PropsWithChildren } from 'react';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import ThemeProvider from './ThemeProvider.tsx';

export default function MainProvider({ children }: PropsWithChildren) {
    return (
        <ReduxProvider>
            <ReactQueryProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </ReactQueryProvider>
        </ReduxProvider>
    );
}
