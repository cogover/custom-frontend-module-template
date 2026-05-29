import { CommonSettingsState } from '@stringeecom/ui-kit';
import { AccountInfoResponse } from 'src/apis/account/account.type';
import { PublicConfigKeys, WorkspaceAccount } from 'src/apis/config/config.type';
import { supportedLanguages } from 'src/languages/i18n';
import { RootState } from 'src/store';
import { ThemeType } from 'src/theme/theme.type';
import { _mock, _mockApiSuccess } from './_mock';
import { VALID_PUBLIC_RSA_KEY } from './publicConfig';

const LOGIN_MESSAGES = {
    empty: 'Please set username and password param',
    incorrect: 'Incorrect username or password.',
};

export const DEFAULT_ACCOUNT_INFO = {
    language: supportedLanguages[0],
    dateFormat: 1 as const,
    timezone: 'Asia/Ho_Chi_Minh',
    timeFormat: 1 as const,
};

export const VERIFIED_ACCOUNT: AccountInfoResponse = {
    id: _mock.id(1),
    status: 1,
    avatar: null,
    email: _mock.email(1),
    firstName: _mock.firstName(1),
    lastName: _mock.lastName(1),
    phoneNumber: _mock.phoneNumber(1),
    language: DEFAULT_ACCOUNT_INFO.language,
    timezone: DEFAULT_ACCOUNT_INFO.timezone,
    dateFormat: DEFAULT_ACCOUNT_INFO.dateFormat,
    timeFormat: DEFAULT_ACCOUNT_INFO.timeFormat,
    phoneCountryCode: 'VN',
    address: 'HCM',
    birthday: 957978000,
    passwordExisted: true,
    isVerified: true,
    numberFormat: 1,
    nameFormat: '{first_name} {last_name}',
    fullName: `${_mock.firstName(1)} ${_mock.lastName(1)}`,
};

export const VERIFIED_WORKSPACE = {
    created: 123123123,
    domain: 'stringee.com',
    name: 'stringee',
    id: '12123',
    dcId: 'asia-1',
    updated: 123123,
    objectMapping: {
        department: 'OBJ8XY06J5UHK',
        departmentPersonnel: 'OBJGNEG42IM4B',
        personnel: 'OBJ8R1JY8743K',
        position: 'OBJTTWPMSIN9E',
    },
    dateFormat: 1,
    timeFormat: 1,
    nameFormat: '{first_name} {last_name}',
    backendSettings: {
        enableMultilingual: true,
    },
    readyForUse: true,
} as CommonSettingsState['workspace'];

export const UNVERIFIED_ACCOUNT = {
    ...VERIFIED_ACCOUNT,
    isVerified: false,
};

export const VALID_CONFIG_RESPONSE: PublicConfigKeys = {
    publicKey: VALID_PUBLIC_RSA_KEY,
};

export const LOGGED_IN_STATE = {
    loading: false,
    account: {
        id: _mock.id(1),
        status: 1,
        avatar: null,
        email: _mock.email(1),
        firstName: _mock.firstName(1),
        lastName: _mock.lastName(1),
        phoneNumber: _mock.phoneNumber(1),
        language: DEFAULT_ACCOUNT_INFO.language,
        timezone: DEFAULT_ACCOUNT_INFO.timezone,
        dateFormat: DEFAULT_ACCOUNT_INFO.dateFormat,
        timeFormat: DEFAULT_ACCOUNT_INFO.timeFormat,
        address: 'HCM',
        birthday: 957978000,
    },
};

export const UNAUTHORIZED_STATE = {
    loading: false,
    account: null,
};

export const EMPTY_LOGIN_REJECT = {
    r: 2,
    msg: LOGIN_MESSAGES.empty,
};

export const INVALID_ACCOUNT = {
    username: 'invalid@stringee.com',
    password: 'INVALID',
};

export const INVALID_LOGIN_REJECT = {
    r: 2,
    msg: LOGIN_MESSAGES.incorrect,
};

export const INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN';
export const VALID_ACCESS_TOKEN = 'VALID_ACCESS_TOKEN';

export const UNAUTHORIZED_ACCOUNT_RESPONSE = {
    r: 40102,
    msg: _mock.apiMsgDefault.error,
    data: null,
};

export const VALID_REGISTER_FORM_VALUES = {
    firstName: _mock.firstName(1),
    lastName: _mock.lastName(1),
    username: _mock.email(1),
    password: 'Password1',
};

export const VALID_REGISTER_PHONE_VALUES = {
    phone: {
        phoneNumber: _mock.phoneNumber(1),
        dialCode: '+1',
    },
    acceptTerms: true,
};
export const VALID_TOKEN_ID = 'VALID_TOKEN_ID';
export const VALID_ACTIVE_EMAIL_CODE = 'VALID_ACTIVE_EMAIL_CODE';
export const INVALID_ACTIVE_EMAIL_CODE = 'INVALID_ACTIVE_EMAIL_CODE';

export const EMAIL_REGISTERED = 'registered@stringee.com';

export const ACCOUNT_CONFIG_DATA = {
    id: 'AC5JFKzbjn',
    firstName: 'adfa',
    lastName: '',
    email: 'hatd+67@stringee.com',
    avatar: '',
    address: '',
    phoneNumber: '',
    phoneCountryCode: '',
    birthday: '',
    status: 1,
    language: 'en-US',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: 2,
    passwordExisted: true,
    isVerified: true,
    setting: {
        theme: 'dark',
        brandColor: '#6b75ca',
    },
    created: 1717744938549,
    updated: 1717744997073,
};

export const WORKSPACE_CONFIG_DATA = {
    id: 'WSEmTvXZK3',
    name: null,
    domain: 'hatd617-2',
    setting: {
        isAvailable: true,
        isShowedToast: true,
    },
    created: 1718636700112,
    updated: 1719481939606,
    status: 1,
    avatar: null,
    readyForUse: true,
    objectMapping: {
        departmentPersonnel: 'OBJZRD9YCNQUY',
        personnel: 'OBJAB6P4EW6ZX',
        position: 'OBJLXU33B1G8K',
        department: 'OBJZJGL6L6IBX',
    },
    disabled: true,
};

export const WORKSPACE_ACCOUNT_CONFIG_DATA = {
    id: 'PEAIXRATAN6Z',
    workspaceId: 'WSEmTvXZK3',
    accountId: 'AC5JFKzbjn',
    lastJoinTime: 1718636706566,
    lastLeftTime: 0,
    language: 'vi-VN',
    timezone: 'Africa/Lome',
    status: 1,
    created: 1718636706566,
    updated: 1719485586986,
    name: '',
    email: 'test@stringee.com',
    avatar: 'https://file-server.stringee.com/avatars/1',
    numberFormat: 1,
    nameFormat: '{first_name} {last_name}',
    personnelId: '1',
    setting: {
        theme: ThemeType.light,
        brandColor: '#6b75ca',
    },
} as WorkspaceAccount;

export const ACCOUNT_CONFIG_RESPONSE_DATA = {
    config: {
        publicKey: '',
    },
    account: ACCOUNT_CONFIG_DATA,
    workspace: WORKSPACE_CONFIG_DATA,
    workspaceAccount: WORKSPACE_ACCOUNT_CONFIG_DATA,
    continueUrl: '',
    tokenID: '66705192c628c7581da58569',
};

export const ACCOUNT_CONFIG_RESPONSE = _mockApiSuccess(ACCOUNT_CONFIG_RESPONSE_DATA);

export const LIGHT_THEME_CONFIG_RESPONSE = _mockApiSuccess({
    ...ACCOUNT_CONFIG_RESPONSE_DATA,
    workspaceAccount: { ...WORKSPACE_ACCOUNT_CONFIG_DATA, setting: { theme: ThemeType.light } },
});

export const DARK_THEME_CONFIG_RESPONSE = _mockApiSuccess({
    ...ACCOUNT_CONFIG_RESPONSE_DATA,
    account: { ...ACCOUNT_CONFIG_RESPONSE_DATA.account, setting: { theme: ThemeType.dark } },
});

export const VALID_COMMON_SETTINGS_STATE: RootState['commonSettings'] = {
    account: VERIFIED_ACCOUNT,
    config: VALID_CONFIG_RESPONSE,
    fetched: true,
    leftMenuIsExpand: true,
    workspace: VERIFIED_WORKSPACE,
    workspaceAccount: WORKSPACE_ACCOUNT_CONFIG_DATA,
    tableSetting: [],
    userPermissions: {
        is_super_admin: true,
    },
    applicationConfig: {},
    apps: [],
    workspaces: [],
    personnel: null,
    billingPermission: {},
    workspaceAuthError: null,
    serviceAppUser: null,
};
