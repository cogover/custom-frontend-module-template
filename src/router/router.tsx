import { createBrowserRouter } from 'react-router-dom';
import RootOutlet from 'src/layouts/RootOutlet/index.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';
import { ROUTE_MAP } from './routeMap.ts';
import PrivateRoute from './PrivateRoute.tsx';
import MainLayout from 'src/layouts/MainLayout/index.tsx';
import HomePage from 'src/pages/HomePage/index.tsx';

const router = createBrowserRouter([
    {
        element: <RootOutlet />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTE_MAP.index,
                element: (
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                ),
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                ],
            },
        ],
    },
]);
export default router;
