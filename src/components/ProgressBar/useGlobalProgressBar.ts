import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch } from 'src/store/hooks';
import { NAV_PROGRESS_SPEED } from 'src/utils/constant/theme';
import useProgressBar, { UseProgressBarProps } from './useProgressBar';
import { useCallback } from 'react';

export default function useGlobalProgressBar({ ...props }: UseProgressBarProps = {}) {
    const dispatch = useAppDispatch();

    const onSetPercentage = useCallback(
        (value: number) => {
            dispatch(
                setCommonSettingState({
                    navProgress: value,
                }),
            );
        },
        [dispatch],
    );

    const progress = useProgressBar({
        speed: NAV_PROGRESS_SPEED,
        closeDelay: 500,
        onSetPercentage: onSetPercentage,
        ...props,
    });

    return {
        ...progress,
    };
}
