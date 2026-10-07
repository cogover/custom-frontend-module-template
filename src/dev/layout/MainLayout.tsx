import { PropsWithChildren, useLayoutEffect } from 'react';
import { useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';
import LeftToolbar from './LeftToolbar';
import TopToolbar from './TopToolbar';

const TOP_TOOLBAR_WIDTH = '56px';
const LEFT_TOOLBAR_COLLAPSED_WIDTH = '60px';
const LEFT_TOOLBAR_EXPANDED_WIDTH = '240px';

/**
 * CHỈ DÙNG CHO DEV STANDALONE — KHÔNG expose qua federation.
 *
 * Mô phỏng khung trang của Cogover (header + sidebar) để hình dung page khi được nhúng.
 * Giống Cogover, layout đặt `--top-toolbar-width` và `--left-toolbar-width` trên `<html>`
 * nên page dùng cùng một code cho cả standalone lẫn khi nhúng.
 */
export default function MainLayout({ children }: PropsWithChildren) {
    const isExpand = useAppSelector((state) => !!state.commonSettings.leftMenuIsExpand);

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--top-toolbar-width', TOP_TOOLBAR_WIDTH);
        root.style.setProperty(
            '--left-toolbar-width',
            isExpand ? LEFT_TOOLBAR_EXPANDED_WIDTH : LEFT_TOOLBAR_COLLAPSED_WIDTH,
        );
    }, [isExpand]);

    return (
        <>
            <LeftToolbar />
            <TopToolbar />
            <div
                className={cx(
                    'w-full pl-[var(--left-toolbar-width)] pt-[var(--top-toolbar-width)]',
                    'bg-background-default text-typo-primary',
                )}
            >
                {children}
            </div>
        </>
    );
}
