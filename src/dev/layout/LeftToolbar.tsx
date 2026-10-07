import { ToggleCollapseButton, Tooltip } from '@cogover/client-sdk/ui';
import { NavLink } from 'react-router-dom';
import logoUrl from 'src/assets/cogover-logo.svg';
import { APP_ROUTES } from 'src/routes';
import { toggleLeftToolbarMenu } from 'src/store/commonSettingsSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';

/** Icon trang mặc định cho route không khai báo `icon`. */
function PageIcon() {
    return (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
            <path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z' strokeLinejoin='round' />
            <path d='M14 3v5h5M9 13h6M9 17h6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    );
}

const MENU_ROUTES = APP_ROUTES.filter((route) => route.name);

/**
 * Sidebar mô phỏng thanh menu trái của Cogover; mỗi mục là một page của module (`APP_ROUTES` có `name`).
 * Thu gọn 60px nền màu chính, mở rộng 240px; trạng thái lưu ở `commonSettings.leftMenuIsExpand`.
 */
export default function LeftToolbar() {
    const dispatch = useAppDispatch();
    const isExpand = useAppSelector((state) => !!state.commonSettings.leftMenuIsExpand);

    return (
        <>
            <nav
                aria-label='Danh sách page'
                className={cx(
                    'fixed bottom-0 left-0 top-0 z-[20] w-[var(--left-toolbar-width)]',
                    'overflow-x-hidden px-[0.5625rem] pb-[1.25rem] pt-[0.9375rem]',
                    {
                        'border-r border-divider-primary bg-background-default': isExpand,
                        'bg-primary-main': !isExpand,
                    },
                )}
            >
                <NavLink to='/' className={cx('mb-[2.125rem] flex h-[1.875rem] items-center')}>
                    <span className={cx('flex w-[2.625rem] shrink-0 justify-center')}>
                        <img alt='Cogover' src={logoUrl} className={cx('w-[1.5rem]')} />
                    </span>
                    {isExpand && <span className={cx('prose-h5 text-typo-primary')}>Cogover</span>}
                </NavLink>

                {MENU_ROUTES.map((route) => (
                    <Tooltip
                        key={route.key}
                        content={route.name}
                        placement='right'
                        offset={[0, 20]}
                        disabled={isExpand}
                    >
                        <NavLink
                            to={`/${route.path ?? ''}`}
                            end
                            className={({ isActive }) =>
                                cx('mb-[1rem] flex h-[2.5rem] items-center rounded', {
                                    'w-full text-typo-primary hover:bg-primary-light-90': isExpand,
                                    'bg-primary-light-90 text-primary-main hover:bg-primary-light-90':
                                        isExpand && isActive,
                                    'w-[2.5rem] text-background-default hover:bg-[rgba(255,255,255,0.2)]': !isExpand,
                                    'bg-[rgba(255,255,255,0.2)]': !isExpand && isActive,
                                })
                            }
                        >
                            <span className={cx('flex w-[2.5rem] shrink-0 justify-center')}>
                                {route.icon ?? <PageIcon />}
                            </span>
                            {isExpand && <span className={cx('flex-1 truncate', 'prose-subtitle2')}>{route.name}</span>}
                        </NavLink>
                    </Tooltip>
                ))}
            </nav>

            <ToggleCollapseButton
                aria-label={isExpand ? 'Thu gọn menu' : 'Mở rộng menu'}
                className={cx('fixed bottom-[1.875rem] z-[20]', {
                    'left-[calc(var(--left-toolbar-width)-1rem)]': isExpand,
                    'left-[var(--left-toolbar-width)]': !isExpand,
                })}
                placement='left'
                variant={isExpand ? 'gray' : 'primary'}
                isCollapsed={!isExpand}
                onClick={() => dispatch(toggleLeftToolbarMenu())}
            />
        </>
    );
}
