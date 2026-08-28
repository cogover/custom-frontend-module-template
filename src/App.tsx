import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { i18n } from 'src/languages/global';
import { APP_ROUTES } from 'src/routes';
import { useDisplayLanguage } from 'src/store/commonSettingsSlice';
import { AppSlugProvider } from 'src/providers/AppSlugProvider';

/**
 * Component được expose ra federation (key `./CustomApp`).
 *
 * Lưu ý:
 * - App chỉ tự cung cấp AppSlugContext; Redux, Router và layout do host cung cấp.
 *   Chế độ standalone bọc các provider còn lại trong `main.tsx`.
 * - Route dùng path TƯƠNG ĐỐI (không leading slash) vì host mount remote dưới splat `*`.
 * - Danh sách route lấy từ `APP_ROUTES`.
 */
export interface CustomAppProps {
    appSlug?: string;
}

export default function App({ appSlug }: CustomAppProps) {
    const displayLanguage = useDisplayLanguage();

    useEffect(() => {
        if (i18n.language !== displayLanguage) {
            void i18n.changeLanguage(displayLanguage);
        }
    }, [displayLanguage]);

    return (
        <AppSlugProvider appSlug={appSlug}>
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
        </AppSlugProvider>
    );
}
