import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Lazy-load các page mẫu — federation sẽ tách thành chunk riêng
const HelloPage = lazy(() => import('./pages/HelloPage'));
const UserPage = lazy(() => import('./pages/UserPage'));
const I18nPage = lazy(() => import('./pages/I18nPage'));

/**
 * Component được expose ra federation (key `./CustomApp`).
 *
 * Lưu ý:
 * - Đây là component BARE: KHÔNG bọc provider, KHÔNG bọc Router.
 *   Khi chạy trong host `router`, host đã cung cấp sẵn provider + Router context.
 *   Chế độ standalone được bọc provider/Router trong `main.tsx`.
 * - Route dùng path TƯƠNG ĐỐI (không leading slash) vì host mount remote dưới splat `*`.
 */
export default function App() {
    return (
        <Suspense>
            <Routes>
                <Route index element={<HelloPage />} />
                <Route path='user/:userId' element={<UserPage />} />
                <Route path='i18n' element={<I18nPage />} />
            </Routes>
        </Suspense>
    );
}
