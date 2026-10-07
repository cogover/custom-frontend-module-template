/**
 * CHỈ DÙNG CHO DEV STANDALONE.
 *
 * Link trang đăng nhập Cogover cho localhost. Phải kèm `workspaceDomain` vì trang đăng nhập không suy ra được
 * workspace từ địa chỉ quay về localhost (giống `loginUrl` của end-user); thiếu tham số này, token trả về không gắn
 * workspace và config-server báo `No workspace info`.
 */
export function getDevLoginUrl(continueUrl: string) {
    const loginUrl = new URL(import.meta.env.DEV_LOGIN_URL as string);
    loginUrl.searchParams.set('continue', continueUrl);
    loginUrl.searchParams.set('workspaceDomain', (import.meta.env.VITE_WORKSPACE_NAME as string).trim().toLowerCase());
    loginUrl.searchParams.set('lang', 'vi-VN');
    return loginUrl.href;
}
