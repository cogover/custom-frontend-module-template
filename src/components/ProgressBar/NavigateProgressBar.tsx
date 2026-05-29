import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { useAppSelector } from 'src/store/hooks';
import { PROGRESS_MOUNTED_PERCENT, PROGRESS_START_PERCENT } from 'src/utils/constant/theme';
import cx from 'src/utils/cx';
import ProgressBar from '.';
import useGlobalProgressBar from './useGlobalProgressBar';

export default function NavigateProgressBar() {
    const { state } = useNavigation();
    const { pathname } = useLocation();

    const navProgress = useAppSelector((state) => state.commonSettings.navProgress);
    const { speed, setPercentage, finish } = useGlobalProgressBar({});

    const numberOfRequest = useIsFetching({ queryKey: [] });

    useEffect(() => {
        if (state === 'loading') {
            setPercentage(PROGRESS_START_PERCENT);
        } else if (state === 'idle') {
            setPercentage(PROGRESS_MOUNTED_PERCENT);
        }
    }, [setPercentage, state]);

    const [startCheckRequest, setStartCheckRequest] = useState(false);
    useEffect(() => {
        setStartCheckRequest(false);
        const timer = setTimeout(() => {
            setStartCheckRequest(true);
        }, 50);

        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

    useEffect(() => {
        if (startCheckRequest && !numberOfRequest) {
            finish();
        }
    }, [finish, numberOfRequest, startCheckRequest]);

    return (
        <ProgressBar
            className={cx('bg-primary-light-30 rounded-xl duration-500')}
            percentage={navProgress ?? 0}
            bgClassName={cx('bg-divider-primary', 'fixed z-50 top-0 left-0 ', {
                'hidden transition-all duration-500': !navProgress,
            })}
            speed={speed + 200}
        />
    );
}
