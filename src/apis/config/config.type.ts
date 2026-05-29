import { AccountSetting } from '../account/account.type';
export { type ServerConfig } from '@stringeecom/ui-kit';

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
