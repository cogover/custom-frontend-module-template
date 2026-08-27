import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { i18n } from 'src/languages/global';
import { APP_ROUTES } from 'src/routes';
import { useDisplayLanguage } from 'src/store/commonSettingsSlice';

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
    const displayLanguage = useDisplayLanguage();

    useEffect(() => {
        if (i18n.language !== displayLanguage) {
            void i18n.changeLanguage(displayLanguage);
        }
    }, [displayLanguage]);

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
