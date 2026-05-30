import { AvatarField, Typography } from '@stringeecom/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from 'src/store/hooks';
import { redirectExternalUrl } from 'src/utils/appUtils';
import cx from 'src/utils/cx';

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
        <div className={cx('w-[16.125rem] px-[0.75rem] py-[0.5rem]', 'bg-background-default')}>
            <div className={cx('mb-[0.75rem] mt-[0.5rem] flex items-center gap-[0.75rem]', 'mx-[0.5rem]')}>
                <AvatarField src={account?.avatar} resolutionSize='small' alt={account?.fullName} size={36} />
                <div className={cx('min-w-0 flex-1')}>
                    <Typography variant='body1' className={cx('truncate text-typo-primary')}>
                        {account?.fullName}
                    </Typography>
                    <Typography variant='caption' className={cx('truncate text-typo-secondary')}>
                        {account?.email}
                    </Typography>
                </div>
            </div>

            <hr className={cx('my-[0.75rem] text-divider-primary')} />

            <button
                type='button'
                onClick={handleLogout}
                className={cx(
                    'flex w-full items-center',
                    'rounded-[0.375rem] px-[0.5rem] py-[0.5rem]',
                    'text-left transition-colors',
                    'hover:bg-menu-hover-bg-color',
                )}
            >
                <Typography variant='body2' className='text-typo-primary'>
                    Đăng xuất
                </Typography>
            </button>
        </div>
    );
}
