export interface WorkspaceErrorType {
    workspace_account_error: string;
    account_email: string;
    workspace_domain: string;
}

export interface AccountType {
    id: string;
    workspaceId: string;
    accountId: string;
    lastJoinTime: number | null;
    lastLeftTime: number;
    language: string;
    timezone: string;
    status: number | string;
    created: number;
    updated: number;
    fullName: string;
    name: string;
    email: string;
    avatar: null;
    permisstion?: string;
    lastName: string;
    firstName: string;
}
