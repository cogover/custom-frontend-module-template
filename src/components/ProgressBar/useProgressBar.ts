import { useCallback, useRef, useState } from 'react';
import { useTimeout } from 'usehooks-ts';

export interface UseProgressBarProps {
    /**
     * ms
     */
    speed?: number;
    /**
     * ms
     */
    closeDelay?: number;
    onSetPercentage?: (value: number) => void;
}

export default function useProgressBar({ speed = 200, closeDelay = 500, onSetPercentage }: UseProgressBarProps = {}) {
    const [percentage, setLocalPercentage] = useState<number>(0);

    const started = useRef(true);

    const setPercentage = useCallback(
        (p: number, { hasStart = true } = {}) => {
            if (hasStart) {
                started.current = true;
            }
            setLocalPercentage(p);
            onSetPercentage && onSetPercentage(p);
        },
        [onSetPercentage],
    );

    const finish = useCallback(() => {
        if (!started.current) {
            return;
        }
        started.current = false;

        setTimeout(() => {
            setPercentage(100, { hasStart: false });
        }, 0);
    }, [setPercentage]);

    useTimeout(
        () => {
            setPercentage(0, { hasStart: false });
        },
        percentage >= 100 ? closeDelay : null,
    );

    return {
        percentage,
        setPercentage,
        finish,
        speed,
    };
}
