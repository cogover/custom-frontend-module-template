import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from 'src/store/hooks';
import { redirectExternalUrl } from 'src/utils/appUtils';
import cx from 'src/utils/cx';
import Avatar from 'src/components/Avatar';

interface Props {
    onClose?: () => void;
}

/**
 * Menu user của Header dev — port từ end-user nhưng RÚT GỌN chỉ còn 1 item logout.
 * CHỈ DÙNG KHI DEV/STANDALONE.
 *
 * Logout là stub dev: host lo logout thật; ở đây chỉ xoá React Query cache rồi
 * điều hướng về trang gốc (chạy lại `DevConfigGate`).
 */
export default function UserMenu({ onClose = () => null }: Props) {
    const queryClient = useQueryClient();
    const account = useAppSelector((state) => state.commonSettings.account);

    const handleLogout = () => {
        onClose();
        queryClient.clear();
        redirectExternalUrl(window.location.origin);
    };

    return (
        <div
            id='dev-user-menu'
            role='menu'
            className={cx('w-[16.125rem] px-[0.75rem] py-[0.5rem]', 'bg-background-default')}
        >
            <div
                role='presentation'
                className={cx('mb-[0.75rem] mt-[0.5rem] flex items-center gap-[0.75rem]', 'mx-[0.5rem]')}
            >
                <Avatar src={account?.avatar} alt={account?.fullName} size={36} resolutionSize='small' />
                <div className={cx('min-w-0 flex-1')}>
                    <p className={cx('truncate prose-body1 text-typo-primary')}>{account?.fullName}</p>
                    <p className={cx('truncate prose-caption text-typo-secondary')}>{account?.email}</p>
                </div>
            </div>

            <hr className={cx('my-[0.75rem] text-divider-primary')} />

            <button
                type='button'
                role='menuitem'
                onClick={handleLogout}
                className={cx(
                    'flex w-full items-center',
                    'rounded-[0.375rem] px-[0.5rem] py-[0.5rem]',
                    'text-left transition-colors',
                    'hover:bg-menu-hover-bg-color',
                )}
            >
                <span className={cx('prose-body2 text-typo-primary')}>Đăng xuất</span>
            </button>
        </div>
    );
}
