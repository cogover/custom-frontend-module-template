/* eslint-disable react-refresh/only-export-components -- file route-config: cố ý xuất cả constant lẫn lazy component */
import { lazy } from 'react';
import type { ReactNode } from 'react';

// Lazy-load các page mẫu — federation sẽ tách thành chunk riêng
const HelloPage = lazy(() => import('./pages/HelloPage'));
const UserPage = lazy(() => import('./pages/UserPage'));

/**
 * Định nghĩa 1 route của custom module.
 *
 * - `key`  : định danh ổn định, dùng cho React key + map menu.
 * - `name` : nhãn hiển thị ở left menu.
 * - `to`   : đích điều hướng TƯƠNG ĐỐI cho `NavLink` ở left menu
 *            (rỗng = index route). Tương đối vì remote mount dưới splat `*` của host.
 * - `path` : path khai báo cho `<Route>`; bỏ trống = index route. Tách khỏi `to`
 *            vì route động (vd `user/:userId`) có path khác đích link mẫu (`user/42`).
 * - `element`: phần tử render cho route.
 */
export interface AppRoute {
    key: string;
    name: string;
    to: string;
    path?: string;
    element: ReactNode;
}

/**
 * Nguồn DUY NHẤT định nghĩa router của module — `App` map ra `<Routes>`,
 * `MainLayout` map ra các item left menu (chỉ cần `key` / `name` / `to`).
 */
export const APP_ROUTES: AppRoute[] = [
    {
        key: 'hello',
        name: 'Trang chào mừng',
        to: '',
        element: <HelloPage />,
    },
    {
        key: 'user',
        name: 'Người dùng (mẫu)',
        to: 'user/42',
        path: 'user/:userId',
        element: <UserPage />,
    },
];
