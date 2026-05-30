import { AvatarField, Link, Popper, PopperRef, Typography } from '@stringeecom/ui-kit';
import { useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';
import { APP_ROUTES } from 'src/routes';
import UserMenu from './UserMenu';

/**
 * Header dev — port từ `TopToolbar` của host (end-user): tên workspace + tiêu đề trang
 * ở trái, avatar mở `UserMenu` (Popper) ở phải. Đọc workspace/account từ Redux
 * (do `DevConfigGate` đổ vào).
 *
 * CHỈ DÙNG KHI DEV/STANDALONE — không expose. Tiêu đề trang suy ra từ route đang active
 * (khớp `APP_ROUTES` theo `path`).
 */
export default function Header() {
    const userMenuPopper = useRef<PopperRef>(null);
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

    const { pathname } = useLocation();
    const account = useAppSelector((state) => state.commonSettings.account);
    const workspace = useAppSelector((state) => state.commonSettings.workspace);

    const activeRoute = APP_ROUTES.find((route) => matchPath({ path: `/${route.path ?? ''}`, end: true }, pathname));
    const title = activeRoute?.name ?? '';

    return (
        <nav
            className={cx(
                'flex items-center justify-between',
                'h-[3.5rem] shrink-0 px-[1.5rem]',
                'border-b border-divider-primary bg-background-default text-typo-primary',
            )}
        >
            <Link to='/' className={cx('block min-w-0')}>
                <div className={cx('flex min-w-0 items-center gap-[0.875rem]')}>
                    <Typography variant='subtitle1' className='truncate'>
                        {workspace?.name || workspace?.domain || 'Workspace'}
                    </Typography>
                    <div className={cx('h-[1.375rem] w-[1px] shrink-0', 'bg-divider-primary')} />
                    <Typography variant='body1' className='truncate text-typo-secondary'>
                        {title}
                    </Typography>
                </div>
            </Link>

            <Popper
                placement='bottom-end'
                ref={userMenuPopper}
                appendTo={{ current: document.body }}
                offset={[0, 10]}
                onShow={() => setIsOpenUserMenu(true)}
                onHide={() => setIsOpenUserMenu(false)}
                render={({ attributes, ...params }) => (
                    <div
                        {...params}
                        {...attributes}
                        className={cx('z-[20]', 'border border-divider-primary shadow-popover')}
                    >
                        <UserMenu onClose={() => userMenuPopper.current?.hide()} />
                    </div>
                )}
            >
                {(params) => (
                    <button
                        {...params}
                        className={cx(
                            'flex items-center justify-center',
                            'h-[2rem] w-[2rem] rounded-full',
                            'outline-none transition',
                            'hover:bg-primary-light-90 focus-visible:bg-primary-light-90',
                            { 'bg-primary-light-90': isOpenUserMenu },
                        )}
                    >
                        <AvatarField src={account?.avatar} resolutionSize='tiny' alt={account?.fullName} size={32} />
                    </button>
                )}
            </Popper>
        </nav>
    );
}
