import { forwardRef, MouseEvent } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps, useHref } from 'react-router-dom';
import useNavigateInterceptor from 'src/hooks/useNavigateInterceptor';
import { useAppSlug } from 'src/providers/appSlugContext';
import { addAppSlugToLink, isAbsoluteUrl } from 'src/utils/appSlugUtils';

export interface LinkProps extends RouterLinkProps {
    withAppSlug?: boolean;
}

function opensNewTab(event: MouseEvent<HTMLAnchorElement>, target?: string) {
    return target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, withAppSlug = true, onClick, ...props }, ref) => {
    const appSlug = useAppSlug();
    const onNavigateIntercept = useNavigateInterceptor();
    const resolvedTo = withAppSlug ? addAppSlugToLink(to, appSlug) : to;
    const routerHref = useHref(resolvedTo, { relative: props.relative });
    // URL tuyệt đối giữ nguyên như `href` React Router gắn vào thẻ `<a>`.
    const href = isAbsoluteUrl(resolvedTo) ? resolvedTo : routerHref;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (event.defaultPrevented || !onNavigateIntercept) return;

        const handled = onNavigateIntercept({
            href,
            target: opensNewTab(event, props.target) ? '_blank' : '_self',
            replace: props.replace,
            source: 'link',
        });
        if (handled) event.preventDefault();
    };

    return <RouterLink {...props} ref={ref} to={resolvedTo} onClick={handleClick} />;
});

Link.displayName = 'Link';

export default Link;
