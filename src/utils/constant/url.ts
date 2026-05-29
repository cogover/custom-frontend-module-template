export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '';
export const ID_APP_ORIGIN = (import.meta.env.VITE_ID_APP_ORIGIN as string) ?? '';
export const DOMAIN_ACCOUNT_APP = (import.meta.env.VITE_ACCOUNT_APP_ORIGIN as string) ?? '';

export const FILE_SERVER_URL = (import.meta.env.VITE_FILE_SERVER_URL as string) ?? '';

export const LOGIN_URL = `${ID_APP_ORIGIN}/login`;
export const LOGOUT_URL = `${ID_APP_ORIGIN}/logout`;
