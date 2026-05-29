import { useParams } from 'react-router-dom';
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

/**
 * Page mẫu ĐỘNG — route `user/:userId`.
 * Demo `useParams()` đọc param từ host router (react-router-dom singleton) + i18n có interpolation.
 */
export default function UserPage() {
    const { userId } = useParams();
    const { t } = useTranslation(I18nNS.APP);

    return (
        <div className='rounded-[0.5rem] border border-divider-primary bg-background-default p-[1rem]'>
            <h2 className='prose-h5 mb-[0.5rem] text-typo-primary'>{t('userPage.title')}</h2>
            <p className='prose-body2 mb-[0.75rem] text-typo-secondary'>{t('userPage.subtitle')}</p>
            <div className='prose-body2 text-typo-secondary'>
                <span className='prose-body1 text-primary-main'>{t('userPage.param', { userId })}</span>
            </div>
        </div>
    );
}
