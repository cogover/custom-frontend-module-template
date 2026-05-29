export function getXsrfToken() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, '$1');
}

export const FORWARD_AUTH_TOKEN_PARAM = 'authToken';
