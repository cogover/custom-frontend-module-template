import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'src/utils/cx';
import { APP_ROUTES } from 'src/routes';
import Header from './Header';

/**
 * Khung layout CHỈ DÙNG KHI DEV/STANDALONE — KHÔNG được expose ra federation.
 *
 * Khi chạy trong host `router`, host đã bọc sẵn MainLayout của host quanh CustomApp,
 * nên `App` (component expose) phải để bare. Layout này chỉ bọc `App` trong `main.tsx`
 * để khi dev riêng module có sidebar điều hướng giữa các page cho dễ thao tác.
 *
 * Left menu map trực tiếp từ `APP_ROUTES` (key / name / to).
 *
 * Routing dùng `NavLink` của `react-router-dom` để giữ đường dẫn tương đối trong module.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className={cx('flex min-h-screen', 'bg-background-default text-typo-primary')}>
            <aside
                className={cx(
                    'flex flex-col gap-[0.25rem]',
                    'w-[15rem] shrink-0 p-[0.75rem]',
                    'border-r border-divider-primary',
                )}
            >
                <div className={cx('mb-[0.5rem] px-[0.5rem]', 'prose-caption1 uppercase text-typo-description')}>
                    Custom Module
                </div>

                {APP_ROUTES.map((route) => (
                    <NavLink
                        key={route.key}
                        to={route.to}
                        end={route.to === ''}
                        className={({ isActive }) =>
                            cx(
                                'block rounded-[0.375rem]',
                                'px-[0.75rem] py-[0.5rem]',
                                'prose-body2 transition-colors',
                                {
                                    'bg-primary-light-96 text-primary-main': isActive,
                                    'text-typo-secondary hover:bg-menu-hover-bg-color': !isActive,
                                },
                            )
                        }
                    >
                        {route.name}
                    </NavLink>
                ))}
            </aside>

            <div className={cx('flex min-w-0 flex-1 flex-col')}>
                <Header />
                <main className={cx('flex-1', 'p-[1rem]')}>{children}</main>
            </div>
        </div>
    );
}
