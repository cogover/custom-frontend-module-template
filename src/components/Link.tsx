import { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps, To } from 'react-router-dom';
import { useAppSlug } from 'src/providers/appSlugContext';

export interface LinkProps extends RouterLinkProps {
    withAppSlug?: boolean;
}

const EXTERNAL_LINK_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

function addAppSlugToPath(pathname: string, appSlug: string) {
    const normalizedAppSlug = appSlug.trim().replace(/^\/+|\/+$/g, '');
    if (!normalizedAppSlug || EXTERNAL_LINK_PATTERN.test(pathname)) return pathname;

    const appRoot = `/${normalizedAppSlug}`;
    if (pathname === appRoot || pathname.startsWith(`${appRoot}/`) || pathname.startsWith(`${appRoot}?`)) {
        return pathname;
    }

    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${appRoot}${normalizedPathname}`;
}

function addAppSlugToLink(to: To, appSlug: string): To {
    if (typeof to === 'string') return addAppSlugToPath(to, appSlug);
    if (!to.pathname) return to;

    return { ...to, pathname: addAppSlugToPath(to.pathname, appSlug) };
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, withAppSlug = true, ...props }, ref) => {
    const appSlug = useAppSlug();
    const resolvedTo = withAppSlug ? addAppSlugToLink(to, appSlug) : to;

    return <RouterLink {...props} ref={ref} to={resolvedTo} />;
});

Link.displayName = 'Link';

export default Link;
