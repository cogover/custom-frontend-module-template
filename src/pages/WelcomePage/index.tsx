import cx from 'src/utils/cx';
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

const logoUrl = `${import.meta.env.BASE_URL}icon/logo.svg`;
const TRAIT_KEYS = ['welcomePage.traitCreative', 'welcomePage.traitExtensible', 'welcomePage.traitIntegrated'] as const;

export default function WelcomePage() {
    const { t: tApp } = useTranslation(I18nNS.APP);

    return (
        <main
            className={cx(
                'relative flex min-h-screen w-full items-center justify-center overflow-hidden',
                'bg-background-default px-[1.5rem] py-[4rem] text-typo-primary',
            )}
        >
            <div aria-hidden='true' className={cx('pointer-events-none absolute inset-0 overflow-hidden')}>
                <div
                    className={cx(
                        'absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2',
                        'rounded-full bg-primary-light-98',
                    )}
                />
                <div
                    className={cx(
                        'absolute -left-[8rem] top-[8%] h-[20rem] w-[20rem] rounded-full',
                        'bg-primary-light-94 opacity-60 blur-[6rem]',
                    )}
                />
                <div
                    className={cx(
                        'absolute -right-[6rem] bottom-[4%] h-[18rem] w-[18rem] rounded-full',
                        'bg-secondary-light-90 opacity-50 blur-[5rem]',
                    )}
                />
            </div>

            <section
                className={cx('relative z-[1] mx-auto flex w-full max-w-[64rem] flex-col items-center text-center')}
            >
                <p
                    className={cx(
                        'rounded-full border border-primary-light-70 bg-background-default',
                        'px-[0.875rem] py-[0.375rem] prose-caption1 uppercase tracking-[0.14em] text-primary-main',
                    )}
                >
                    {tApp('welcomePage.label')}
                </p>

                <div className={cx('relative mt-[3rem] flex h-[18rem] w-[18rem] items-center justify-center')}>
                    <div
                        aria-hidden='true'
                        className={cx(
                            'absolute inset-0 rounded-full border border-primary-light-70',
                            'animate-[spin_20s_linear_infinite] motion-reduce:animate-none',
                        )}
                    >
                        <span
                            className={cx(
                                'absolute left-1/2 top-[-0.375rem] h-[0.75rem] w-[0.75rem] -translate-x-1/2',
                                'rounded-full bg-primary-main shadow-primary',
                            )}
                        />
                        <span
                            className={cx(
                                'absolute bottom-[1.5rem] right-[1.25rem] h-[0.5rem] w-[0.5rem]',
                                'rounded-full bg-secondary-main',
                            )}
                        />
                    </div>

                    <div
                        aria-hidden='true'
                        className={cx(
                            'absolute inset-[1.75rem] rounded-full border border-dashed border-divider-primary',
                            'animate-[spin_28s_linear_infinite_reverse] motion-reduce:animate-none',
                        )}
                    />

                    <div
                        className={cx(
                            'relative flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-[2rem]',
                            'border border-divider-primary bg-background-default shadow-primary',
                        )}
                    >
                        <div
                            aria-hidden='true'
                            className={cx('absolute inset-[0.625rem] rounded-[1.5rem] bg-primary-light-96')}
                        />
                        <img
                            src={logoUrl}
                            alt='Cogover'
                            className={cx('relative h-[5.75rem] w-[5.75rem] object-contain')}
                        />
                    </div>
                </div>

                <div className={cx('mt-[2rem] max-w-[48rem]')}>
                    <h1 className={cx('prose-h3 text-typo-primary tablet:prose-h4')}>{tApp('welcomePage.title')}</h1>
                    <p className={cx('mx-auto mt-[1rem] max-w-[40rem] prose-subtitle2 text-typo-secondary')}>
                        {tApp('welcomePage.description')}
                    </p>
                </div>

                <div
                    className={cx(
                        'mt-[2rem] inline-flex items-center gap-[0.625rem] rounded-full',
                        'border border-divider-primary bg-background-default px-[1rem] py-[0.625rem] shadow-secondary',
                    )}
                >
                    <span aria-hidden='true' className={cx('h-[0.5rem] w-[0.5rem] rounded-full bg-success')} />
                    <span className={cx('prose-body1 text-typo-secondary')}>{tApp('welcomePage.status')}</span>
                </div>

                <div className={cx('mt-[3rem] flex flex-wrap items-center justify-center gap-[0.75rem]')}>
                    {TRAIT_KEYS.map((key) => (
                        <span
                            key={key}
                            className={cx(
                                'rounded-[0.5rem] bg-gray-5 px-[0.875rem] py-[0.5rem]',
                                'prose-caption1 text-typo-secondary',
                            )}
                        >
                            {tApp(key)}
                        </span>
                    ))}
                </div>
            </section>
        </main>
    );
}
