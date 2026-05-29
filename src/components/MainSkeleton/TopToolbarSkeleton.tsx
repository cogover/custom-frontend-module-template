import { faBars } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from '@stringeecom/ui-kit';
import cx from 'src/utils/cx';

export default function TopToolbarSkeleton() {
    return (
        <div data-testid='top-toolbar-skeleton'>
            <nav className={cx('top-toolbar')}>
                <div className='left'></div>
                <button className={cx('hidden mobile:!inline-block')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cx('right', 'mobile:!hidden')}>
                    <Skeleton variant='circular' className={cx('w-[24px] h-[24px]')} />
                    <Skeleton variant='circular' className={cx('w-[24px] h-[24px]')} />
                    <Skeleton variant='circular' className={cx('w-[24px] h-[24px]')} />
                    <Skeleton variant='circular' className={cx('w-[32px] h-[32px]')} />
                </div>
            </nav>
        </div>
    );
}
