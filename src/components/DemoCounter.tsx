import { useState } from 'react';
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';
import cx from 'src/utils/cx';

export default function DemoCounter() {
    const [count, setCount] = useState(0);
    const { t } = useTranslation(I18nNS.APP);

    return (
        <div
            className={cx(
                'flex flex-wrap items-center gap-[1rem] rounded-[0.5rem] p-[1rem]',
                'border border-divider-primary bg-background-default text-typo-primary prose-body2',
            )}
        >
            <p role='status'>{t('demoCounter.clickCount', { value: count })}</p>
            <button
                type='button'
                onClick={() => setCount((previous) => previous + 1)}
                className={cx(
                    'min-h-[2.75rem] rounded-[0.375rem] px-[1rem] py-[0.5rem]',
                    'bg-primary-main text-white prose-text-button',
                    'cursor-pointer hover:opacity-90 focus-visible:outline focus-visible:outline-2',
                    'focus-visible:outline-offset-2 focus-visible:outline-primary-main',
                )}
            >
                {t('demoCounter.increment')}
            </button>
        </div>
    );
}
