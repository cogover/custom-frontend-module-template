import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

/**
 * Page mẫu TĨNH — route `hello`.
 * Demo Tailwind + design token + i18n (resource bundle local trong dự án).
 */
export default function HelloPage() {
    const { t } = useTranslation(I18nNS.APP);

    return (
        <div className='rounded-[0.5rem] border border-divider-primary bg-background-default p-[1rem]'>
            <h2 className='prose-h5 mb-[0.5rem] text-typo-primary'>{t('helloPage.title')}</h2>
            <p className='prose-body2 text-typo-secondary'>{t('helloPage.subtitle')}</p>
        </div>
    );
}
