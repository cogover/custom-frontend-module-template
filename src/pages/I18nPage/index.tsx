import { Button } from '@stringeecom/ui-kit';
import { useTranslation } from 'src/languages/global';
import { I18nNS, locales, type LocaleKeys } from 'src/languages/i18n';
import cx from 'src/utils/cx';

/**
 * Page mẫu ĐA NGÔN NGỮ.
 * Demo: đổi ngôn ngữ runtime (`i18n.changeLanguage`) + dịch có interpolation,
 * dùng resource bundle local trong dự án (`src/languages/locales/<lng>/app.json`).
 */
export default function I18nPage() {
    const { t, i18n } = useTranslation(I18nNS.APP);
    const currentLang = i18n.language;

    return (
        <div
            className={cx(
                'flex flex-col gap-[1rem]',
                'rounded-[0.5rem] border border-divider-primary bg-background-default',
                'p-[1rem]',
            )}
        >
            <div>
                <h2 className='prose-h5 mb-[0.25rem] text-typo-primary'>{t('i18nPage.title')}</h2>
                <p className='prose-body2 text-typo-secondary'>{t('i18nPage.subtitle')}</p>
            </div>

            <div className='flex items-center gap-[0.75rem]'>
                <span className='prose-body2 text-typo-secondary'>{t('i18nPage.switchLabel')}</span>
                {(Object.keys(locales) as LocaleKeys[]).map((lng) => (
                    <Button
                        key={lng}
                        size='small'
                        variant={currentLang === lng ? 'contained' : 'outlined'}
                        onClick={() => void i18n.changeLanguage(lng)}
                    >
                        {locales[lng]}
                    </Button>
                ))}
            </div>

            <div className='flex flex-col gap-[0.5rem] rounded-[0.375rem] bg-primary-light-96 p-[0.75rem]'>
                <span className='prose-body2 text-typo-secondary'>
                    {t('i18nPage.current', { lang: locales[currentLang as LocaleKeys] ?? currentLang })}
                </span>
                <span className='prose-body1 text-primary-main'>{t('i18nPage.greeting', { name: 'Cogover' })}</span>
            </div>
        </div>
    );
}
