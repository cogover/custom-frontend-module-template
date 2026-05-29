import { I18nProvider, ThemeProvider as StringeeThemeProvider, StringeeUtilProvider } from '@stringeecom/ui-kit';
import {
    keepPreviousData,
    useInfiniteQuery,
    useIsMutating,
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
    useFormState,
    useWatch,
} from 'react-hook-form';
import { Link, NavLink, useBlocker, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'src/languages/global';
import Trans from 'src/languages/global/Trans';
import { useSelectTheme } from 'src/store/commonSettingsSlice';
import { useAppSelector } from 'src/store/hooks';

import { ThemeType } from 'src/theme/theme.type';

function ThemeProvider({ children }: PropsWithChildren) {
    const themeMode = useSelectTheme() ?? ThemeType.light;
    const { t, i18n } = useTranslation();

    const account = useAppSelector((state) => state.commonSettings.account);

    const workspace = useAppSelector((state) => state.commonSettings.workspace);
    const workspaceAccount = useAppSelector((state) => state.commonSettings.workspaceAccount);

    return (
        <StringeeThemeProvider themeMode={themeMode}>
            <I18nProvider t={t} locale={i18n.language} Trans={Trans}>
                <StringeeUtilProvider
                    useSearchParams={useSearchParams}
                    Controller={Controller}
                    useLocation={useLocation}
                    FormProvider={FormProvider}
                    useForm={useForm}
                    useMutation={useMutation}
                    useQueryClient={useQueryClient}
                    useFieldArray={useFieldArray}
                    useFormContext={useFormContext}
                    useNavigate={useNavigate}
                    useWatch={useWatch}
                    useQuery={useQuery}
                    keepPreviousData={keepPreviousData}
                    useInfiniteQuery={useInfiniteQuery}
                    Link={Link}
                    NavLink={NavLink}
                    account={account}
                    workspace={workspace}
                    workspaceAccount={workspaceAccount}
                    useBlocker={useBlocker}
                    useFormState={useFormState}
                    useParams={useParams}
                    useQueries={useQueries}
                    useIsMutating={useIsMutating}
                >
                    {children}
                </StringeeUtilProvider>
            </I18nProvider>
        </StringeeThemeProvider>
    );
}

export default ThemeProvider;
