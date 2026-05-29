import cx from 'src/utils/cx';

interface Props {
    percentage: number;
    className?: string;
    bgClassName?: string;
    /**
     * Speed of the progress bar animation in milliseconds
     */
    speed?: number;
}

function ProgressBar({ percentage, className, bgClassName, speed = 200 }: Props) {
    return (
        <div data-testid='progress-bar' className={cx('w-full', bgClassName)}>
            <div
                className={cx('h-[4px]', className)}
                style={{
                    transform: `translate3d(-${100 - percentage}%, 0, 0)`,
                    transition: `all ${speed}ms ease 0s`,
                }}
            />
        </div>
    );
}

export default ProgressBar;
