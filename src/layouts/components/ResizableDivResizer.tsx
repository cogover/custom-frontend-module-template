import { useCallback, useEffect, useMemo, useRef } from 'react';

import useResponsive from 'src/hooks/useResponsive.ts';
import { cxBind } from 'src/utils/cx.ts';
import { toggleLeftToolbarMenu } from '../../store/commonSettingsSlice.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';

import { useLocalStorage } from 'usehooks-ts';
import styles from '../styles/resizableDivResizer.module.scss';

const cxModule = cxBind(styles);

const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 150;
const root = document.documentElement;

const SIDEBAR_WIDTH_STORAGE_KEY = 'SIDEBAR_WIDTH_STORAGE_KEY';

export default function ResizableDivResizer() {
    const [defaultWidth, setDefaultWidth] = useLocalStorage(SIDEBAR_WIDTH_STORAGE_KEY, DEFAULT_WIDTH);

    const changeMenuWidth = useCallback(
        (newWith: number) => {
            // Lưu lại giá trị mới vào local storage
            setDefaultWidth(newWith);
            root.style.setProperty('--left-toolbar-width', `${newWith}px`);
        },
        [setDefaultWidth],
    );

    useEffect(() => {
        // Lần đầu load page nếu menu đang mở rộng thì sẽ lấy giá trị từ local storage
        if (commonSettings.leftMenuIsExpand) {
            // TODO: làm tạm như này, phải refactor lại không dùng biến CSS nữa
            root.style.setProperty('--left-toolbar-width', `${defaultWidth}px`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { width } = useResponsive();
    const MAX_WIDTH = useMemo(() => {
        return (width / 100) * 40;
    }, [width]);

    const dispatch = useAppDispatch();

    const commonSettings = useAppSelector((state) => state.commonSettings);

    const isResizing = useRef(false);

    const originalX = useRef(0);
    const prevWidth = useRef(defaultWidth);
    const newWidthRef = useRef(0);
    const styleElement = useRef<HTMLStyleElement>(document.createElement('style'));

    const injectStyle = useCallback(() => {
        const headElement = document.querySelector('head');
        headElement && headElement.append(styleElement.current);
    }, []);

    const removeStyle = useCallback(() => {
        styleElement.current && styleElement.current.remove();
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            originalX.current = e.clientX;
            injectStyle();
            isResizing.current = true;
        },
        [injectStyle],
    );

    // Refresh các trạng thái khi kết thúc việc resize
    useEffect(() => {
        const handle = () => {
            if (!isResizing.current) {
                return;
            }
            isResizing.current = false;
            removeStyle();
            originalX.current = 0;
            prevWidth.current = newWidthRef.current;
        };
        window.addEventListener('mouseup', handle);
        window.addEventListener('touchend', handle);

        return () => {
            window.removeEventListener('mouseup', handle);
            window.removeEventListener('touchend', handle);
        };
    }, [removeStyle]);

    const toggleLeftMenu = useCallback(() => {
        if (!commonSettings.leftMenuIsExpand) {
            changeMenuWidth(prevWidth.current);
        }
        dispatch(toggleLeftToolbarMenu());
    }, [changeMenuWidth, commonSettings.leftMenuIsExpand, dispatch]);

    const handleMove = useCallback(
        (clientX: number) => {
            const diffX = clientX - originalX.current;
            let newWidth = prevWidth.current + diffX;
            if (newWidth <= MIN_WIDTH - 100) {
                newWidthRef.current = DEFAULT_WIDTH;
                prevWidth.current = DEFAULT_WIDTH;
                isResizing.current = false;
                toggleLeftMenu();
                return;
            }

            newWidth = Math.min(MAX_WIDTH, newWidth);
            newWidth = Math.max(MIN_WIDTH, newWidth);

            newWidthRef.current = newWidth;
            changeMenuWidth(newWidth);
        },
        [MAX_WIDTH, changeMenuWidth, toggleLeftMenu],
    );

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            if (!isResizing.current) {
                return;
            }
            handleMove(e.clientX);
        };
        window.addEventListener('mousemove', handle);

        return () => {
            window.removeEventListener('mousemove', handle);
        };
    }, [handleMove, toggleLeftMenu]);

    // binding event cho tablet
    useEffect(() => {
        const handle = (e: TouchEvent) => {
            if (!isResizing.current) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            handleMove(e.touches[0].clientX);
        };
        window.addEventListener('touchmove', handle);

        return () => {
            window.removeEventListener('touchmove', handle);
        };
    }, [handleMove]);

    useEffect(() => {
        styleElement.current.innerHTML = `
            * {
                user-select: none !important;
            }

            *:disabled {
                pointer-events: none;
            }
        `;
    }, []);

    return (
        <>
            {commonSettings.leftMenuIsExpand && (
                <div
                    className={cxModule('resizable-resizer')}
                    onMouseDown={handleMouseDown}
                    onPointerDown={handleMouseDown}
                >
                    <div className={cxModule('line')}></div>
                </div>
            )}
            {/* <ToggleCollapseButton
                className={cxModule('fixed z-[20] bottom-[30px]', 'tablet:opacity-100', 'mobile:hidden', {
                    'left-[calc(var(--left-toolbar-width)-16px)]': commonSettings.leftMenuIsExpand,
                    'left-[var(--left-toolbar-width)]': !commonSettings.leftMenuIsExpand,
                    'opacity-0': !commonSettings.leftMenuIsExpand,
                    'opacity-100': showExpandedButton
                })}
                placement='left'
                variant={commonSettings.leftMenuIsExpand ? 'gray' : 'primary'}
                onClick={toggleLeftMenu}
                isCollapsed={!commonSettings.leftMenuIsExpand}
            /> */}
        </>
    );
}
