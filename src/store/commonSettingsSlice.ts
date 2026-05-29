import { createSlice } from '@reduxjs/toolkit';
import { CommonSettingsState } from '@stringeecom/ui-kit';
import { DEFAULT_LANG } from 'src/languages/i18n';
import { localBrandColor, localTheme } from 'src/utils/appUtils';
import { useAppSelector } from './hooks';

const initialState: CommonSettingsState = {
    leftMenuIsExpand: false,
    rightFilterExpand: false,
    publicConfig: {
        publicKey: '',
    },
    fetched: false,
    error: false,
    errorData: null,
    config: {
        publicKey: '',
    },
    account: null,
    workspace: null,
    workspaceAccount: null,
    tableSetting: [],
    userPermissions: {},
    applicationConfig: {},
    billingPermission: {},
    apps: [],
    workspaces: [],
    isProgressive: true,
    personnel: null,
    workspaceAuthError: null,
    serviceAppUser: null,
};

const slice = createSlice({
    name: 'commonSettings',
    initialState,

    reducers: (create) => ({
        toggleLeftToolbarMenu: create.reducer<boolean | undefined>((state, action) => {
            if (action?.payload === undefined) {
                state.leftMenuIsExpand = !state.leftMenuIsExpand;
            } else {
                state.leftMenuIsExpand = action?.payload;
            }
        }),

        toggleRightFilter: create.reducer<boolean | undefined>((state, action) => {
            if (action?.payload === undefined) {
                state.rightFilterExpand = !state.rightFilterExpand;
            } else {
                state.rightFilterExpand = action?.payload;
            }
        }),

        setCommonSettingState: create.reducer<Partial<CommonSettingsState>>((state, action) => {
            const theme = action.payload.workspaceAccount?.setting?.theme ?? action.payload.account?.setting?.theme;
            const brandColor =
                action.payload.workspaceAccount?.setting?.brandColor ?? action.payload.account?.setting?.brandColor;
            if (theme) {
                localTheme().set(theme);
            }

            if (brandColor) {
                localBrandColor().set(brandColor);
            }

            return {
                ...state,
                ...action.payload,
            };
        }),
    }),
});

export const useSelectTheme = () => {
    const workspaceAccountTheme = useAppSelector((state) => state.commonSettings.workspaceAccount?.setting?.theme);
    const theme = workspaceAccountTheme ?? localTheme().get();
    return theme;
};

export const useSelectBrandColor = () => {
    const WorkspaceAccountBrandColor = useAppSelector(
        (state) => state.commonSettings.workspaceAccount?.setting?.brandColor,
    );
    const brandColor = WorkspaceAccountBrandColor ?? localBrandColor().get();
    return brandColor;
};

export const useSelectDisplayDateFormat = () => {
    return useAppSelector((state) => state.commonSettings.workspace?.dateFormat);
};

export const useSelectDisplayTimeFormat = () => {
    return useAppSelector((state) => state.commonSettings.workspace?.timeFormat);
};

export const useSelectDateTimeFormat = () => {
    const dateFormat = useSelectDisplayDateFormat();
    const timeFormat = useSelectDisplayTimeFormat();
    return `${dateFormat} ${timeFormat}`;
};

export const useSelectWorkspaceName = (): string => {
    const workspaceName = useAppSelector((state) => state.commonSettings.workspace?.name);
    const workspaceDomain = useAppSelector((state) => state.commonSettings.workspace?.domain);
    return workspaceName ?? workspaceDomain ?? '';
};

export const useSelectTableSetting = (tableName: string) => {
    const tableSettings = useAppSelector((state) => state.commonSettings.tableSetting);
    return tableSettings.find((setting) => setting.tableName === tableName);
};

export const useDisplayLanguage = () => {
    return useAppSelector((state) => state.commonSettings.workspaceAccount?.language) ?? DEFAULT_LANG;
};

export const useSelectWorkspaceDCId = () => {
    return useAppSelector((state) => state.commonSettings.workspace?.dcId) ?? 'asia-1';
};

export const { toggleLeftToolbarMenu, toggleRightFilter, setCommonSettingState } = slice.actions;
export default slice.reducer;
