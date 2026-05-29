import { faArrowUpRightFromSquare } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@stringeecom/ui-kit';

import cx from 'src/utils/cx';

interface Item {
    icon: React.ReactNode;
    title: string;
    linkTo?: string;
    onClick?: () => void;
    className?: string;
}

interface GroupProps {
    title: string;
    linkTo?: string;
    items?: Item[];
}

export function MenuItem({ icon, title, linkTo, className, ...restProps }: Item) {
    return (
        <div
            className={cx(
                'flex justify-between items-center',
                'p-[6px_8px]',
                'rounded',
                'cursor-pointer',
                'hover:bg-primary-light-90',
                className,
            )}
            {...restProps}
        >
            <div className={cx('flex gap-[8px] items-center')}>
                <span className={cx('w-[18px] inline-flex justify-center')}>{icon}</span>
                <Link className={cx('prose-body2 text-typo-primary')} to={linkTo ? linkTo : ''}>
                    {title}
                </Link>
            </div>
        </div>
    );
}

export default function MenuGroup({ title, linkTo, items }: GroupProps) {
    return (
        <div>
            <div className={cx('flex justify-between')}>
                <p className={cx('text-[1rem] text-primary-main', 'p-[4px_8px]')}>{title}</p>
                {!!linkTo && (
                    <Link to={linkTo} className={cx('text-typo-primary')}>
                        <FontAwesomeIcon
                            fontSize={16}
                            icon={faArrowUpRightFromSquare}
                            className={cx('text-typo-primary')}
                        />
                    </Link>
                )}
            </div>
            {!!items && (
                <div className={cx('flex flex-col gap-[4px]', 'mt-[4px]')}>
                    {items.map((item) => {
                        return <MenuItem {...item} key={item.title} />;
                    })}
                </div>
            )}
        </div>
    );
}
