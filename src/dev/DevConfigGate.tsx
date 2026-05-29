import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PropsWithChildren, useEffect } from 'react';
import { configApi, configApiKeys } from 'src/apis/config/config.api';
import { i18n } from 'src/languages/global';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch } from 'src/store/hooks';
import { FORWARD_AUTH_TOKEN_PARAM } from 'src/utils/authUtils';

const NOT_RETRY_STATUS = [400, 401, 403];

/**
 * CHỈ DÙNG CHO DEV STANDALONE — KHÔNG expose qua federation.
 *
 * Khi chạy trong host `router`, host đã gọi config API và set sẵn `commonSettings` vào
 * Redux (shared store), nên component `App` được expose KHÔNG cần luồng này.
 * Standalone (`npm run dev`/`preview`) thì không có host → gate này gọi config API và đổ
 * vào store để các provider (ThemeProvider…) có account/workspace/theme thật.
 *
 * Bỏ qua phần `apps` (app menu items) và `workspaces` (danh sách menu chuyển workspace).
 */
export default function DevConfigGate({ children }: PropsWithChildren) {
    const dispatch = useAppDispatch();

    const { data, isError, isPending } = useQuery({
        queryKey: [configApiKeys.GET_SERVER_CONFIG],
        queryFn: async () => {
            const token = new URLSearchParams(window.location.search).get(FORWARD_AUTH_TOKEN_PARAM) ?? '';
            return await configApi.getServerConfigRpc({ token });
        },
        select: (resp) => resp.data.body.data,
        retry: (failureCount, error) => {
            const status = (error as AxiosError).response?.status;
            if (status && NOT_RETRY_STATUS.includes(status)) return false;
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (isError) {
            dispatch(setCommonSettingState({ fetched: true, error: true }));
            return;
        }

        if (data?.config) {
            dispatch(
                setCommonSettingState({
                    fetched: true,
                    account: data.account,
                    config: data.config,
                    workspace: data.workspace,
                    workspaceAccount: data.workspaceAccount,
                    tableSetting: data.tableSetting,
                    userPermissions: data.userPermissions,
                    applicationConfig: data.applicationConfig,
                    billingPermission: data.billingPermission,
                    personnel: data.personnel,
                    workspaceAuthError: data.workspaceAuthError,
                    serviceAppUser: data.serviceAppUser,
                }),
            );

            // Đồng bộ ngôn ngữ theo cấu hình tài khoản (theme mode đã được ThemeProvider tự áp).
            const userLanguage = data.workspaceAccount?.language ?? data.account?.language;
            if (userLanguage) {
                void i18n.changeLanguage(userLanguage);
            }
        }
    }, [data, isError, dispatch]);

    // Chỉ render children SAU KHI config API gọi xong (settled — success hoặc error)
    if (isPending) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <span className='prose-body2 text-typo-secondary'>Đang tải cấu hình…</span>
            </div>
        );
    }

    return <>{children}</>;
}
