import { ReactNode } from 'react';
import images from 'src/assets/images';
import useResponsive from 'src/hooks/useResponsive';
import { useSelectTheme } from 'src/store/commonSettingsSlice';
import { ThemeType } from 'src/theme/theme.type';
import cx from 'src/utils/cx';
import { LogoWithName } from '../icons';

interface ReturnError {
    type?: 'error' | 'success';
    content: ReactNode;
    className?: string;
    contentIllustration?: string;
}

export default function PageMessage({
    content,
    type = 'success',
    className,
    contentIllustration = images.register.activeSuccess,
}: Readonly<ReturnError>) {
    const themeMode = useSelectTheme() ?? ThemeType.light;

    const backgroundImage = {
        error:
            themeMode !== ThemeType.dark ? images.pageMessage.errorBackground : images.pageMessage.errorBackgroundDark,
        success:
            themeMode !== ThemeType.dark
                ? images.pageMessage.successBackground
                : images.pageMessage.successBackgroundDark,
    };

    const { isMobile, isLandscape, isTablet, isMediumDesktop } = useResponsive();
    return (
        <div
            className={cx(
                'h-full',
                'desktop:pt-[6rem] mobile:pt-[3.625rem] text-center mx-auto tablet:',
                'bg-no-repeat bg-contain bg-primary-light-96',
                className,
                {
                    'py-[2rem]': (isTablet || isMobile) && isLandscape,
                    'pt-[8rem]': isTablet && !isLandscape,
                },
            )}
            style={{
                backgroundImage: `url(${backgroundImage[type]})`,
                height: '100vh',
                backgroundSize: isMediumDesktop ? '1753px 780px' : 'contain',
                backgroundPosition: 'center bottom',
            }}
        >
            <div
                className={cx(
                    'border',
                    'border-solid',
                    'rounded-lg',
                    'border-[var(--divider-primary)]',
                    'bg-white',
                    'max-w-[720px]',
                    'm-auto',
                    'py-[60px]',
                )}
            >
                <div className={cx('flex gap-4 items-center justify-center')}>
                    <LogoWithName />
                </div>
                {type === 'success' && (
                    <span className={cx('mt-8', 'flex justify-center')}>
                        <img src={contentIllustration} alt='success' />
                    </span>
                )}
                <div className='mt-8'>
                    <div className={cx('max-w-[700px] mx-auto')}>{content}</div>
                </div>
            </div>
        </div>
    );
}
