import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from 'src/routes';

/**
 * Component được expose ra federation (key `./CustomApp`).
 *
 * Lưu ý:
 * - Đây là component BARE: KHÔNG bọc provider, KHÔNG bọc Router, KHÔNG bọc layout.
 *   Khi chạy trong host `router`, host đã cung cấp sẵn provider + Router context + MainLayout.
 *   Chế độ standalone được bọc provider/Router (và `MainLayout` dev) trong `main.tsx`.
 * - Route dùng path TƯƠNG ĐỐI (không leading slash) vì host mount remote dưới splat `*`.
 * - Danh sách route lấy từ `APP_ROUTES` — nguồn chung mà `MainLayout` (dev) dùng để dựng left menu.
 */
export default function App() {
    return (
        <Suspense>
            <Routes>
                {APP_ROUTES.map((route) =>
                    route.path ? (
                        <Route key={route.key} path={route.path} element={route.element} />
                    ) : (
                        <Route key={route.key} index element={route.element} />
                    ),
                )}
            </Routes>
        </Suspense>
    );
}
