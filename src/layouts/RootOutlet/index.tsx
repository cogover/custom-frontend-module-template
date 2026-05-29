import { CommonSettingsState, ToastContainer } from '@stringeecom/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Fragment, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { ErrorApiResponse } from 'src/apis/apiBase';
import { configApi, configApiKeys } from 'src/apis/config/config.api';
import { WorkspaceErrorType } from 'src/apis/management-account/management-account.type';
import NavigateProgressBar from 'src/components/ProgressBar/NavigateProgressBar';
import { useTranslation } from 'src/languages/global';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { removeSearchParam } from 'src/utils/appUtils';
import { FORWARD_AUTH_TOKEN_PARAM } from 'src/utils/authUtils';

dayjs.extend(utc);
dayjs.extend(timezone);

const NOT_RETRY_STATUS = [HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden];

export default function RootOutlet() {
    const { i18n } = useTranslation();

    const workspaceAccountLanguage = useAppSelector((state) => state.commonSettings.workspaceAccount?.language);
    const accountLanguage = useAppSelector((state) => state.commonSettings.account?.language);
    const userLanguage = workspaceAccountLanguage ?? accountLanguage;

    useEffect(() => {
        if (userLanguage) {
            void i18n.changeLanguage(userLanguage);
        }
    }, [userLanguage, i18n]);

    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const authTokenParam = searchParams.get(FORWARD_AUTH_TOKEN_PARAM) ?? '';

    const result = useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [configApiKeys.GET_SERVER_CONFIG],
        queryFn: async () => {
            const token = typeof authTokenParam === 'string' ? authTokenParam : '';
            return await configApi.getServerConfig({ token });
        },
        select: (data) => data.data.data,
        refetchInterval: 3600000,
        retry(failureCount, error) {
            if (error.response?.status && NOT_RETRY_STATUS.includes(error.response?.status)) {
                return false;
            }
            return failureCount < 3;
        },
    });

    const { data, isError, error, isLoading } = result;

    useEffect(() => {
        if (isError) {
            const errorDataRes = error.response?.data as unknown as ErrorApiResponse<WorkspaceErrorType>;
            dispatch(
                setCommonSettingState({
                    fetched: true,
                    error: true,
                    errorData: errorDataRes as CommonSettingsState['errorData'],
                }),
            );
        } else if (data?.config) {
            if (authTokenParam) {
                const searchParams = removeSearchParam(FORWARD_AUTH_TOKEN_PARAM);
                window.history.replaceState({}, '', `${window.location.pathname}${searchParams}`);
            }
            dispatch(
                setCommonSettingState({
                    fetched: true,
                    account: data.account,
                    config: data.config,
                    workspace: data.workspace,
                    tokenID: data.tokenID,
                    workspaceAccount: data.workspaceAccount,
                    tableSetting: data.tableSetting,
                    userPermissions: data.userPermissions,
                }),
            );
        }
    }, [data, authTokenParam, dispatch, isError, error]);

    if (!isLoading) {
        return (
            <Fragment>
                <NavigateProgressBar />
                <Outlet />
                <ToastContainer />
                <ToastContainer placement='bottom-right' />
            </Fragment>
        );
    }
}
