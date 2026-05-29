import {
    faArrowRightFromBracket,
    faArrowUpRightFromSquare,
    faArrowsRetweet,
    faPenToSquare,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvatarField, Link, Typography } from '@stringeecom/ui-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'src/languages/global';
import { useLogout } from 'src/apis/account/account.api';
import useGetLoginUrl from 'src/hooks/useGetLoginUrl';
import { routeMapFullPath } from 'src/router/routeMap';
import { useAppSelector } from 'src/store/hooks';
import { redirectExternalUrl } from 'src/utils/appUtils';
import { DOMAIN_ACCOUNT_APP } from 'src/utils/constant/url';
import cx from 'src/utils/cx';
import { MenuItem } from './MenuGroup';

interface Props {
    onClose?: () => void;
}

export default function UserMenu(props: Props) {
    const { onClose = () => null } = props;

    const { t } = useTranslation('app');
    const { getLoginUrl } = useGetLoginUrl();
    const queryClient = useQueryClient();
    const account = useAppSelector((state) => state.commonSettings.account);
    const personnelId = useAppSelector((state) => state.commonSettings.workspaceAccount?.personnelId);

    const { mutateAsync: logout } = useLogout();

    const handleLogout = async () => {
        queryClient.clear();
        await logout();
        redirectExternalUrl(getLoginUrl());
    };

    return (
        <div className={cx('w-[258px] px-3 py-2', 'bg-background-default')}>
            <div className='mx-2 mt-2 mb-1'>
                <div className={cx('flex items-center gap-x-3', 'mb-3')}>
                    <AvatarField
                        src={account?.avatar}
                        resolutionSize='small'
                        alt={account?.fullName}
                        id={personnelId}
                        size={36}
                    />
                    <div className={cx('flex-1')}>
                        <Typography
                            variant='body1'
                            className={cx('text-typo-primary', 'max-w-[150px] text-ellipsis whitespace-nowrap')}
                        >
                            {account?.fullName}
                        </Typography>
                        <Typography
                            variant='caption'
                            className={cx(
                                'text-typo-secondary whitespace-nowrap text-ellipsis',
                                'max-w-[150px] overflow-hidden',
                            )}
                        >
                            {account?.email}
                        </Typography>
                    </div>
                </div>
                <Link to={DOMAIN_ACCOUNT_APP} target='_blank' className='text-info'>
                    <div className={cx('flex justify-between items-center')}>
                        <Typography variant='caption2'>{t('securityPersonal.accountManagement')}</Typography>
                        <span>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-main' />
                        </span>
                    </div>
                </Link>
            </div>
            <hr className={cx('my-3', 'text-divider-primary')} />
            <Typography variant='subtitle1' className={cx('text-typo-primary')}>
                <span className={cx('px-2 py-1')}>Human Resources</span>
            </Typography>

            <MenuItem
                icon={<FontAwesomeIcon icon={faPenToSquare} className='text-primary-main' />}
                onClick={onClose}
                title='Personal settings'
                linkTo={routeMapFullPath.index}
                className='mb-1'
            />

            <hr className={cx('my-3', 'text-divider-primary')} />
            <MenuItem
                icon={<FontAwesomeIcon icon={faArrowsRetweet} className='text-primary-main' />}
                title='Switch account'
                className='mb-1'
            />
            <MenuItem
                icon={<FontAwesomeIcon icon={faArrowRightFromBracket} className='text-primary-main' />}
                title='Log out'
                onClick={() => void handleLogout()}
            />
        </div>
    );
}
