import { To } from 'react-router-dom';

const EXTERNAL_LINK_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;
/** Đích chỉ đổi query/hash hoặc path tương đối (`./`, `../`): router tự resolve theo vị trí hiện tại. */
const RELATIVE_LINK_PATTERN = /^(?:[?#]|\.\.?(?:\/|$))/;

/** URL tuyệt đối (`https://`, `mailto:`, `tel:`, `//`), cùng quy tắc với React Router `Link`. */
export function isAbsoluteUrl(to: unknown): to is string {
    return typeof to === 'string' && EXTERNAL_LINK_PATTERN.test(to);
}

export function addAppSlugToPath(pathname: string, appSlug: string) {
    const normalizedAppSlug = appSlug.trim().replace(/^\/+|\/+$/g, '');
    if (!normalizedAppSlug || EXTERNAL_LINK_PATTERN.test(pathname) || RELATIVE_LINK_PATTERN.test(pathname)) {
        return pathname;
    }

    const appRoot = `/${normalizedAppSlug}`;
    if (pathname === appRoot || pathname.startsWith(`${appRoot}/`) || pathname.startsWith(`${appRoot}?`)) {
        return pathname;
    }

    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${appRoot}${normalizedPathname}`;
}

/** Gắn app slug vào đích điều hướng; URL ngoài, `?query`, `#hash`, `./`, `../` và standalone (slug rỗng) giữ nguyên. */
export function addAppSlugToLink(to: To, appSlug: string): To {
    if (typeof to === 'string') return addAppSlugToPath(to, appSlug);
    if (!to.pathname) return to;

    return { ...to, pathname: addAppSlugToPath(to.pathname, appSlug) };
}
