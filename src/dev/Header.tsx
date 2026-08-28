import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import Link from 'src/components/Link';
import Avatar from 'src/components/Avatar';
import { useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';
import { APP_ROUTES } from 'src/routes';
import UserMenu from './UserMenu';

/**
 * Header dev — port từ `TopToolbar` của host (end-user): tên workspace + tiêu đề trang
 * ở trái, avatar mở `UserMenu` ở phải. Đọc workspace/account từ Redux
 * (do `DevConfigGate` đổ vào).
 *
 * CHỈ DÙNG KHI DEV/STANDALONE — không expose. Tiêu đề trang suy ra từ route đang active
 * (khớp `APP_ROUTES` theo `path`).
 */
export default function Header() {
    const userMenuWrapper = useRef<HTMLDivElement>(null);
    const avatarButton = useRef<HTMLButtonElement>(null);
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

    const { pathname } = useLocation();
    const account = useAppSelector((state) => state.commonSettings.account);
    const workspace = useAppSelector((state) => state.commonSettings.workspace);

    const activeRoute = APP_ROUTES.find((route) => matchPath({ path: `/${route.path ?? ''}`, end: true }, pathname));
    const title = activeRoute?.name ?? '';

    useEffect(() => {
        if (!isOpenUserMenu) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!userMenuWrapper.current?.contains(event.target as Node)) setIsOpenUserMenu(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpenUserMenu(false);
                avatarButton.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpenUserMenu]);

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
                    <span className={cx('truncate prose-subtitle1')}>
                        {workspace?.name || workspace?.domain || 'Workspace'}
                    </span>
                    <div className={cx('h-[1.375rem] w-[1px] shrink-0', 'bg-divider-primary')} />
                    <span className={cx('truncate prose-body1 text-typo-secondary')}>{title}</span>
                </div>
            </Link>

            <div ref={userMenuWrapper} className={cx('relative')}>
                <button
                    ref={avatarButton}
                    type='button'
                    aria-label='Mở menu người dùng'
                    aria-haspopup='menu'
                    aria-expanded={isOpenUserMenu}
                    aria-controls='dev-user-menu'
                    onClick={() => setIsOpenUserMenu((isOpen) => !isOpen)}
                    className={cx(
                        'flex items-center justify-center',
                        'h-[2rem] w-[2rem] rounded-full',
                        'outline-none transition',
                        'hover:bg-primary-light-90 focus-visible:bg-primary-light-90',
                        { 'bg-primary-light-90': isOpenUserMenu },
                    )}
                >
                    <Avatar src={account?.avatar} alt={account?.fullName} size={32} resolutionSize='tiny' />
                </button>
                {isOpenUserMenu ? (
                    <div
                        className={cx(
                            'absolute right-0 top-[calc(100%+0.625rem)] z-[20]',
                            'border border-divider-primary shadow-primary',
                        )}
                    >
                        <UserMenu onClose={() => setIsOpenUserMenu(false)} />
                    </div>
                ) : null}
            </div>
        </nav>
    );
}
