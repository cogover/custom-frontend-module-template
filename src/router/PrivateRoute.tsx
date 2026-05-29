import { Stack, TextLink, Typography } from '@stringeecom/ui-kit';
import { PropsWithChildren } from 'react';
import images from 'src/assets/images';
import TopToolbarSkeleton from 'src/components/MainSkeleton/TopToolbarSkeleton';
import PageMessage from 'src/components/PageMessage';
import Trans from 'src/components/Trans';
import useGetLoginUrl from 'src/hooks/useGetLoginUrl';
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';
import { useAppSelector } from 'src/store/hooks.ts';
import { redirectExternalUrl } from 'src/utils/appUtils';
import { SITE_DOMAIN } from 'src/utils/constant/app';
import { DOMAIN_ACCOUNT_APP } from 'src/utils/constant/url';

export default function PrivateRoute({ children }: PropsWithChildren) {
    if (!children) throw new Error('Children is required');
    const { t: tApp } = useTranslation(I18nNS.APP);

    const fetchedAccountInfo = useAppSelector((state) => state.commonSettings.fetched);
    const { error, errorData } = useAppSelector((state) => state.commonSettings);
    const isAuthenticated = useAppSelector((state) => state.commonSettings.account);
    const workspace = useAppSelector((state) => state.commonSettings.workspace);

    const { getLoginUrl } = useGetLoginUrl();

    if (!fetchedAccountInfo) {
        return <TopToolbarSkeleton />;
    }

    if (!isAuthenticated) {
        redirectExternalUrl(
            getLoginUrl({
                continue: window.location.href,
            }),
        );
        return null;
    }

    if (error && errorData?.msg === 'WORKSPACE_ACCOUNT_ERROR') {
        redirectExternalUrl(
            getLoginUrl({
                continue: window.location.href,
            }),
        );
        return;
    }

    if (error) {
        return <PageMessage content='Có lỗi xảy ra, vui lòng thử lại sau' type='error' />;
    }

    if (!workspace?.readyForUse) {
        return (
            <PageMessage
                content={
                    <Stack className='gap-8'>
                        <Typography variant='body2' className='text-typo-primary'>
                            <Trans
                                t={tApp}
                                i18nKey='WorkspacePage.workspaceIsCreating'
                                components={{
                                    1: <strong />,
                                }}
                                values={{
                                    wsName: `${workspace?.domain}.${SITE_DOMAIN}`,
                                }}
                            />
                        </Typography>
                        <Typography variant='body2' className='text-typo-secondary'>
                            <Trans
                                t={tApp}
                                i18nKey='WorkspacePage.orVisitAccountManagement'
                                components={{
                                    1: (
                                        <TextLink
                                            onClick={() => redirectExternalUrl(DOMAIN_ACCOUNT_APP)}
                                            className='cursor-pointer'
                                        />
                                    ),
                                }}
                            />
                        </Typography>
                    </Stack>
                }
                contentIllustration={images.pageMessage.unavailableWorkspace}
            />
        );
    }
    return children;
}
