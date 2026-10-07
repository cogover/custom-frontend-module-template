/* eslint-disable react-refresh/only-export-components -- file route-config: cố ý xuất cả constant lẫn lazy component */
import { lazy } from 'react';
import type { ReactNode } from 'react';

// Lazy-load các page mẫu — federation sẽ tách thành chunk riêng
const WelcomePage = lazy(() => import('./pages/WelcomePage'));

/**
 * Định nghĩa 1 route của custom module.
 *
 * - `key`  : định danh ổn định, dùng cho React key.
 * - `path` : path khai báo cho `<Route>`; bỏ trống = index route.
 * - `element`: phần tử render cho route.
 * - `name` : tên page trên sidebar của layout dev standalone; bỏ trống = không hiện trên sidebar
 *   (vd route có tham số `customers/:customerId`).
 * - `icon` : icon trên sidebar dev; bỏ trống dùng icon trang mặc định.
 */
export interface AppRoute {
    key: string;
    path?: string;
    element: ReactNode;
    name?: string;
    icon?: ReactNode;
}

/** Nguồn duy nhất định nghĩa router của module — `App` map ra `<Routes>`. */
export const APP_ROUTES: AppRoute[] = [
    {
        key: 'welcome',
        name: 'Trang giới thiệu',
        element: <WelcomePage />,
    },
];
