import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { checkMobileDevice } from 'src/utils/responsiveUtils';

export default function useResponsive() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        function updateSize() {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const isLargeDesktop = useMemo(() => {
        return width >= 1280;
    }, [width]);

    const isDesktop = useMemo(() => {
        return width >= 1024;
    }, [width]);

    const isAuthDesktop = useMemo(() => {
        return width >= 1025;
    }, [width]);

    const isAuthTablet = useMemo(() => {
        return width < 1025 && width > 560;
    }, [width]);

    const isTablet = useMemo(() => {
        return width < 1025 && width > 560;
    }, [width]);

    const isMobile = useMemo(() => {
        return width <= 560;
    }, [width]);

    const isLandscape = useMemo(() => width > height, [width, height]);

    const isMaxWidth = useCallback(
        (maxWidth: number) => {
            return width <= maxWidth;
        },
        [width],
    );

    const isMobileDevice = useMemo(() => {
        return checkMobileDevice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    const isMediumDesktop = useMemo(() => {
        return width >= 1440;
    }, [width]);

    return {
        isDesktop,
        isLargeDesktop,
        isTablet,
        isMobile,
        isAuthDesktop,
        isAuthTablet,
        isMobileDevice,
        isLandscape,
        width,
        height,
        isMediumDesktop,
        isMaxWidth,
    };
}
