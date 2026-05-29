import type { Router } from '@remix-run/router/dist/router';
import { RouterProvider } from 'react-router-dom';

import MainProvider from './providers/index.tsx';
import router from './router/router.tsx';

interface AppProps {
    appRouter?: Router;
}

function App({ appRouter }: AppProps) {
    return (
        <MainProvider>
            <RouterProvider router={appRouter ? appRouter : router} />
        </MainProvider>
    );
}

export default App;
