import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { configApi, configApiKeys } from 'src/apis/config/config.api';
import { i18n } from 'src/languages/global';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { FORWARD_AUTH_TOKEN_PARAM } from 'src/utils/authUtils';
import { getDevLoginUrl } from './devLoginUrl';

const NOT_RETRY_STATUS = [400, 401, 403];
/** config-server: `No workspace info` — phiên không gắn với workspace nào. */
const NO_WORKSPACE_INFO_CODE = 190065;

/**
 * CHỈ DÙNG CHO DEV STANDALONE — KHÔNG expose qua federation.
 *
 * Khi nhúng vào Cogover, nền tảng đã gọi config API và set sẵn `commonSettings` vào
 * Redux (shared store), nên component `App` được expose KHÔNG cần luồng này.
 * Standalone (`npm run dev`/`preview`) thì không có host → gate này gọi config API và đổ
 * vào store để các provider (ThemeProvider…) có account/workspace/theme thật.
 */
export default function DevConfigGate({ children }: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const account = useAppSelector((state) => state.commonSettings.account);
    const [sessionApplied, setSessionApplied] = useState(false);
    const [token] = useState(() => new URLSearchParams(window.location.search).get(FORWARD_AUTH_TOKEN_PARAM) ?? '');
    const continueUrl = useMemo(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete(FORWARD_AUTH_TOKEN_PARAM);
        return url.href;
    }, []);
    const workspaceDomain = (import.meta.env.VITE_WORKSPACE_NAME as string).trim().toLowerCase();
    const loginHref = getDevLoginUrl(continueUrl);

    const { data, error, isError, isPending } = useQuery({
        queryKey: [configApiKeys.GET_SERVER_CONFIG, workspaceDomain, token, continueUrl],
        queryFn: async () => {
            await configApi.checkSession({ token, continueUrl, workspaceDomain });
            return await configApi.getServerConfigRpc({ token });
        },
        select: (resp) => resp.data.data,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            const status = (error as AxiosError).response?.status;
            if (status && NOT_RETRY_STATUS.includes(status)) return false;
            return failureCount < 3;
        },
    });

    const errorResponse = error?.response;
    const needsLogin =
        errorResponse?.status === 401 ||
        // Phiên đăng nhập chưa gắn workspace (token cấp khi thiếu `workspaceDomain`): đăng nhập lại để lấy phiên mới.
        errorResponse?.data?.r === NO_WORKSPACE_INFO_CODE ||
        (!isPending && !isError && !data?.account) ||
        (sessionApplied && !account);
    // Token trả về không hợp lệ: dừng để người dùng chọn đăng nhập lại, tránh vòng lặp chuyển trang.
    const invalidToken = needsLogin && !!token && !sessionApplied;

    useEffect(() => {
        if (needsLogin && !invalidToken) window.location.replace(loginHref);
    }, [needsLogin, invalidToken, loginHref]);

    useEffect(() => {
        if (data?.account && data.config && !sessionApplied) {
            dispatch(
                setCommonSettingState({
                    fetched: true,
                    error: false,
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

            window.history.replaceState(window.history.state, '', continueUrl);
            setSessionApplied(true);

            // Đồng bộ ngôn ngữ theo cấu hình tài khoản (theme mode đã được ThemeProvider tự áp).
            const userLanguage = data.workspaceAccount?.language ?? data.account?.language;
            if (userLanguage) {
                void i18n.changeLanguage(userLanguage);
            }
        }
    }, [data, dispatch, continueUrl, sessionApplied]);

    if (needsLogin) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center gap-[1rem]'>
                <p className='prose-body2 text-typo-secondary'>
                    {invalidToken ? 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' : 'Đang chuyển đến đăng nhập…'}
                </p>
                {invalidToken && (
                    <button
                        type='button'
                        className='prose-body2 text-primary-main underline'
                        onClick={() => window.location.replace(loginHref)}
                    >
                        Đăng nhập lại
                    </button>
                )}
            </div>
        );
    }

    if (isError || (!isPending && !data?.config)) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <p className='prose-body2 text-typo-secondary'>
                    Không tải được cấu hình workspace. Vui lòng kiểm tra quyền truy cập và tải lại trang.
                </p>
            </div>
        );
    }

    if (isPending || !sessionApplied) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <span className='prose-body2 text-typo-secondary'>Đang tải cấu hình…</span>
            </div>
        );
    }

    return <>{children}</>;
}
