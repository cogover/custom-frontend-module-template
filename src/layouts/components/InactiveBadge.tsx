import { faTriangleExclamation, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextLink, Typography } from '@stringeecom/ui-kit';
import { useEffect, useState } from 'react';
import { useTranslation } from 'src/languages/global';
import Trans from 'src/languages/global/Trans';
import useResendActiveEmail from 'src/hooks/useResendActiveEmail';
import { useAppSelector } from 'src/store/hooks';
import cx from 'src/utils/cx';

export default function InactiveBadge() {
    const { t } = useTranslation();
    const email = useAppSelector((state) => state.commonSettings.account?.email);
    const isVerified = useAppSelector((state) => state.commonSettings.account?.isVerified);
    const [badgeRef, setBadgeRef] = useState<HTMLDivElement | null>(null);

    const [isHideClicked, setIsHideClicked] = useState(false);

    const { count, mutateAsync, resetCountdown, startCountdown, sent, setSent } = useResendActiveEmail();

    const handleResendEmail = async () => {
        await mutateAsync({
            uri: '/v1/accounts/requestEmailActive',
            method: 'GET',
        });
        setSent(true);
        resetCountdown();
        startCountdown();
    };

    useEffect(() => {
        if (!isVerified) {
            const badgeSpace = document.getElementById('inactiveAccountBadgeSpace');
            if (badgeRef && badgeSpace && !isHideClicked) {
                const badgeHeight = badgeRef.clientHeight;
                badgeSpace.style.height = `${badgeHeight}px`;
            }
        }

        return () => {
            const badgeSpace = document.getElementById('inactiveAccountBadgeSpace');
            if (badgeSpace) {
                badgeSpace.style.height = '0px';
            }
        };
    }, [isVerified, badgeRef, isHideClicked]);

    if (isHideClicked) return null;
    if (isVerified) return null;
    return (
        <div
            data-testid='inactive-badge'
            ref={setBadgeRef}
            className={cx('bg-secondary-light-80', 'flex justify-between gap-x-3', 'px-6 py-3')}
        >
            <div className={cx('flex gap-3')}>
                <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className={cx('text-typo-primary')}
                    style={{
                        marginTop: '0.25rem',
                    }}
                />

                <div className={cx('flex flex-col gap-1')}>
                    <Typography variant='subtitle1' className='text-typo-primary'>
                        {t('verifyEmail.verifyAccount')}
                    </Typography>
                    <Typography variant='body2' className={cx('text-typo-secondary')}>
                        <Trans
                            i18nKey={'verifyEmail.commonContentHeader'}
                            values={{
                                emailAddress: email,
                            }}
                            components={{
                                1: <Typography variant='body1' component='span' className='inline-block' />,
                            }}
                        />
                        <br />
                        {sent && count ? (
                            <Trans
                                i18nKey={'verifyEmail.resendAfter'}
                                components={{
                                    1: <strong />,
                                }}
                                values={{
                                    remainTime: count,
                                }}
                            ></Trans>
                        ) : (
                            <Trans
                                i18nKey={sent ? 'verifyEmail.resendEmail' : 'verifyEmail.checkEmail'}
                                components={{
                                    1: (
                                        <TextLink
                                            className={cx('cursor-pointer', {
                                                'px-1': !sent,
                                            })}
                                            component='button'
                                            data-testid='inactive-badge-resend'
                                            onClick={() => {
                                                void handleResendEmail();
                                            }}
                                        />
                                    ),
                                }}
                            />
                        )}
                    </Typography>
                </div>
            </div>
            <FontAwesomeIcon
                data-testid='inactive-badge-close'
                icon={faXmark}
                className={cx('text-typo-primary')}
                height={14}
                width={14}
                fontSize={'14px'}
                style={{
                    padding: '1px',
                    cursor: 'pointer',
                }}
                onClick={() => setIsHideClicked(true)}
            />
        </div>
    );
}

export const InactiveBadgeSpace = () => {
    return <div id='inactiveAccountBadgeSpace'></div>;
};
