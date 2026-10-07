import { Avatar, Popper, PopperMenuItem, showToastMessage } from '@cogover/client-sdk/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { accountApi, accountApiKeys } from 'src/apis/account/account.api';
import { getDevLoginUrl } from 'src/dev/devLoginUrl';
import type { ImageResponse } from 'src/apis/account/account.type';
import { useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';

/** URL ảnh avatar từ dữ liệu file của Cogover (cỡ `small`), giống `AvatarField` của ui-kit. */
function getAvatarUrl(avatar?: ImageResponse | null) {
    if (!avatar || typeof avatar === 'string') return avatar ?? undefined;
    const fileId = avatar.fileId ?? avatar.file_id;
    if (!avatar.url || !fileId) return undefined;
    return avatar.url.replace('{resolution_size}', avatar.resizable ? 'small' : '').replace('{file_id}', fileId);
}

function LogoutIcon() {
    return (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8'>
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' strokeLinecap='round' strokeLinejoin='round' />
            <path d='M16 17l5-5-5-5M21 12H9' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
    );
}

/**
 * Đăng xuất giống end-user: huỷ phiên workspace rồi chuyển tới trang đăng nhập (kèm `workspaceDomain`)
 * để chọn tài khoản khác; đăng nhập xong quay lại trang hiện tại.
 */
function useDevLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: accountApiKeys.logout(),
        mutationFn: () => accountApi.logout(),
        onSuccess: () => {
            queryClient.clear();
            window.location.replace(getDevLoginUrl(window.location.href));
        },
        onError: (error) => {
            showToastMessage({ type: 'error', title: 'Đăng xuất không thành công', message: error.message });
        },
    });
}

/** Menu tài khoản khi bấm avatar, giống end-user: avatar, họ tên, email và Đăng xuất. */
function UserMenu() {
    const account = useAppSelector((state) => state.commonSettings.account);
    const personnelId = useAppSelector((state) => state.commonSettings.workspaceAccount?.personnelId);
    const { mutate: logout, isPending } = useDevLogout();

    return (
        <div className={cx('w-[16.125rem] px-[0.75rem] py-[0.5rem]', 'bg-background-default')}>
            <div className={cx('mx-[0.5rem] my-[0.5rem] flex items-center gap-x-[0.75rem]')}>
                <Avatar
                    src={getAvatarUrl(account?.avatar)}
                    alt={account?.fullName}
                    id={personnelId}
                    size={36}
                    personnelDetailPopperProps={{ disabled: true }}
                />
                <div className={cx('min-w-0 flex-1')}>
                    <p className={cx('truncate', 'prose-body1 text-typo-primary')}>{account?.fullName}</p>
                    <p className={cx('truncate', 'prose-caption1 text-typo-secondary')}>{account?.email}</p>
                </div>
            </div>
            <hr className={cx('my-[0.75rem] border-divider-primary')} />
            <PopperMenuItem
                component='button'
                type='button'
                disabled={isPending}
                className={cx('w-full rounded px-[0.5rem]', 'disabled:cursor-wait disabled:opacity-60')}
                onClick={() => logout()}
            >
                <span className={cx('flex w-[1.25rem] justify-center text-primary-main')}>
                    <LogoutIcon />
                </span>
                {isPending ? 'Đang đăng xuất…' : 'Đăng xuất'}
            </PopperMenuItem>
        </div>
    );
}

/** Header mô phỏng thanh trên của Cogover (theo end-user): tên workspace | tên ứng dụng, avatar mở menu tài khoản. */
export default function TopToolbar() {
    // Giống Cogover: tên workspace rỗng thì hiện domain.
    const workspaceName = useAppSelector(
        (state) => state.commonSettings.workspace?.name || state.commonSettings.workspace?.domain,
    );
    const account = useAppSelector((state) => state.commonSettings.account);
    const personnelId = useAppSelector((state) => state.commonSettings.workspaceAccount?.personnelId);
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

    return (
        <header
            className={cx(
                'fixed right-0 top-0 z-[20] flex h-[var(--top-toolbar-width)] w-[calc(100%-var(--left-toolbar-width))]',
                'items-center justify-between px-[1.5rem]',
                'border-b border-divider-primary bg-background-default text-typo-primary',
            )}
        >
            <div className={cx('flex items-center gap-[1.25rem]')}>
                <span className={cx('prose-subtitle1')}>{workspaceName}</span>
                <span className={cx('h-[1.375rem] w-px bg-divider-primary')} />
                <span className={cx('prose-body1')}>Custom Module</span>
            </div>

            <Popper
                placement='bottom-end'
                offset={[0, 10]}
                appendTo={{ current: document.body }}
                onShow={() => setIsOpenUserMenu(true)}
                onHide={() => setIsOpenUserMenu(false)}
                render={({ attributes, ...params }) => (
                    <div
                        {...params}
                        {...attributes}
                        className={cx('z-[20]', 'border border-divider-primary shadow-popover')}
                    >
                        <UserMenu />
                    </div>
                )}
            >
                {(params) => (
                    <button
                        {...params}
                        type='button'
                        aria-label='Tài khoản'
                        className={cx(
                            'flex h-[2rem] w-[2rem] items-center justify-center rounded-full',
                            'outline-none hover:bg-primary-light-90 focus-visible:bg-primary-light-90',
                            { 'bg-primary-light-90': isOpenUserMenu },
                        )}
                    >
                        <Avatar
                            src={getAvatarUrl(account?.avatar)}
                            alt={account?.fullName}
                            id={personnelId}
                            personnelDetailPopperProps={{ disabled: true }}
                        />
                    </button>
                )}
            </Popper>
        </header>
    );
}
