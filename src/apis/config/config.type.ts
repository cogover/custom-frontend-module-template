import { AccountInfoResponse, AccountSetting } from '../account/account.type';
import { ErrorApiResponse } from 'src/utils/types/api.type';

export interface PublicConfig {
    publicKey: string;
}

export interface ServerConfigParams {
    token?: string | null;
}

export interface PublicConfigKeys {
    publicKey: string;
}

export interface ObjectMapping {
    department: string;
    departmentPersonnel: string;
    personnel: string;
    position: string;
}

export interface BackendSettings {
    enableMultilingual: boolean;
}

export interface WorkspaceConfig {
    created: number;
    domain: string;
    name: string;
    id: string;
    updated: number;
    objectMapping?: ObjectMapping;
    dateFormat: 1 | 2 | 3 | 4;
    timeFormat: 1 | 2;
    nameFormat: string;
    backendSettings: BackendSettings;
    readyForUse: boolean;
    numberFormat: 1 | 2 | null;
    timezone: string;
    dcId?: string;
}

export interface ServerConfigMetaResponse {
    workspaces_count: number;
}

export interface WorkspaceAccount {
    id: string;
    personnelId: null | string;
    workspaceId: string;
    accountId: string;
    lastJoinTime: number;
    lastLeftTime: number;
    language: string;
    timezone: string;
    status: number;
    created: number;
    updated: number;
    name: string;
    email: string;
    avatar: string;
    setting: AccountSetting;
    numberFormat: 1 | 2 | null;
}

export interface TableSetting {
    id: string;
    tableName: string;
    settings: string;
    personnelId: string;
    workspaceId: string;
    updated: number;
    created: number;
}

export interface AppMenu {
    id: string;
    slug: string;
    [key: string]: unknown;
}

export interface ServerConfig {
    config: PublicConfigKeys;
    account: AccountInfoResponse | null;
    tokenID: string;
    workspace: WorkspaceConfig | null;
    workspaceAccount: WorkspaceAccount | null;
    tableSetting: TableSetting[];
    userPermissions: Record<string, unknown>;
    applicationConfig: Record<string, unknown>;
    billingPermission: Record<string, unknown>;
    apps: AppMenu[];
    workspaces: WorkspaceConfig[];
    personnel: unknown;
    workspaceAuthError: unknown;
    serviceAppUser: unknown;
}

export interface CommonSettingsState extends Omit<ServerConfig, 'tokenID'> {
    leftMenuIsExpand?: boolean;
    rightFilterExpand?: boolean;
    publicConfig?: PublicConfig;
    fetched?: boolean;
    error?: boolean;
    errorData?: ErrorApiResponse<unknown> | null;
    tokenID?: string;
    isProgressive?: boolean;
}
