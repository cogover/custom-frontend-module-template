import { EnhancedStore } from '@reduxjs/toolkit';
import { RenderHookOptions, render, renderHook as renderHookRTL, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import {
    Link,
    MemoryRouter,
    NavLink,
    NavigateProps,
    createMemoryRouter,
    useBlocker,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom';
import App from 'src/App';
import { afterEach, beforeEach, expect, vi } from 'vitest';

import router from '../router/router.tsx';
import { AppStore, RootState, appStore, setupStore } from '../store';
import { ThemeType } from '../theme/theme.type.ts';

// load cac CSS toan cuc ma page load vao day
import { StringeeUtilProvider, ThemeProvider, ToastContainer } from '@stringeecom/ui-kit';
import {
    QueryClient,
    keepPreviousData,
    useInfiniteQuery,
    useIsMutating,
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {
    Controller,
    FormProvider,
    useFieldArray,
    useForm,
    useFormContext,
    useFormState,
    useWatch,
} from 'react-hook-form';
import 'src/languages/i18n';
import { defaultQueryClient } from 'src/providers/helper/queryClient.ts';
import 'src/styles/index.css';
import ReactQueryProvider from '../providers/ReactQueryProvider.tsx';
interface ProviderMockOptions {
    preloadedState?: Partial<RootState>;
    routeUri?: string;
    store?: AppStore;
    theme?: ThemeType;
    queryClient?: QueryClient;
}

// for render hook with new redux setup
interface ExtendedRenderHookOptions<Props> extends RenderHookOptions<Props> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
    routeUri?: '/';
    theme?: ThemeType;
    queryClient?: QueryClient;
}

export const delay = (time: number) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });

export const renderApp = (uri?: string, store?: EnhancedStore) => {
    const memoryRouter = createMemoryRouter(router.routes, {
        initialEntries: [uri ? uri : '/'],
        initialIndex: 1,
    });

    return {
        user: userEvent.setup(),
        ...render(
            <Provider store={store ? store : appStore}>
                <App appRouter={memoryRouter} />
            </Provider>,
        ),
    };
};

export const renderComponent = (
    component: ReactNode,
    {
        routeUri = '/',
        preloadedState = {},
        store = setupStore(preloadedState),
        theme,
        queryClient = defaultQueryClient,
    }: ProviderMockOptions = {},
) => {
    return {
        user: userEvent.setup(),
        store,
        ...render(
            <ReactQueryProvider queryClient={queryClient}>
                <StringeeUtilProvider
                    useSearchParams={useSearchParams}
                    Controller={Controller}
                    Link={Link}
                    keepPreviousData={keepPreviousData}
                    useLocation={useLocation}
                    useNavigate={useNavigate}
                    useInfiniteQuery={useInfiniteQuery}
                    useFieldArray={useFieldArray}
                    useFormContext={useFormContext}
                    useQuery={useQuery}
                    NavLink={NavLink}
                    account={null}
                    workspace={null}
                    workspaceAccount={null}
                    FormProvider={FormProvider}
                    useForm={useForm}
                    useMutation={useMutation}
                    useQueryClient={useQueryClient}
                    useWatch={useWatch}
                    useBlocker={useBlocker}
                    useFormState={useFormState}
                    useParams={useParams}
                    useQueries={useQueries}
                    useIsMutating={useIsMutating}
                >
                    <ThemeProvider themeMode={theme}>
                        <Provider store={store}>
                            <MemoryRouter initialEntries={[routeUri]}>
                                {component}
                                <ToastContainer />
                            </MemoryRouter>
                        </Provider>
                    </ThemeProvider>
                </StringeeUtilProvider>
            </ReactQueryProvider>,
        ),
    };
};

export function renderHook<Result = unknown, Props = unknown>(
    hook: (initialProps: Props) => Result,
    {
        routeUri = '/',
        preloadedState = {},
        store = setupStore(preloadedState),
        theme,
        queryClient = defaultQueryClient,
        ...renderHookOptions
    }: ExtendedRenderHookOptions<Props> = {},
) {
    const Wrapper = ({ children }: { children?: ReactNode }) => (
        <ReactQueryProvider queryClient={queryClient}>
            <ThemeProvider themeMode={theme}>
                <Provider store={store}>
                    <MemoryRouter initialEntries={[routeUri]}>{children}</MemoryRouter>
                    <ToastContainer />
                </Provider>
            </ThemeProvider>
        </ReactQueryProvider>
    );

    return {
        store,
        ...renderHookRTL(hook, { wrapper: Wrapper, ...renderHookOptions }),
    };
}

export const getRandomInt = (min: number, max: number) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

export const debugScreen = () => {
    screen.debug(undefined, Infinity);
};

export const sleep = (delay: number) =>
    new Promise((res) =>
        setTimeout(() => {
            res(true);
        }, delay),
    );

export const expectToast = async ({ title, message }: { title: string; message: string | RegExp }) => {
    expect(await screen.findByText(title, undefined, { timeout: 3000 })).toBeVisible();
    expect(await screen.findByText(message, undefined, { timeout: 3000 })).toBeVisible();
};

export const createRRDMock = () => {
    const mockFn = vi.hoisted(() => ({
        useNavigateMock: vi.fn(),
        useParamsMock: vi.fn(() => ({})),
    }));

    vi.mock('react-router-dom', async () => {
        return {
            ...(await vi.importActual('react-router-dom')),
            useNavigate: () => mockFn.useNavigateMock,
            Navigate: ({ to }: NavigateProps) => `Redirected to ${typeof to === 'string' ? to : JSON.stringify(to)}`,
            useParams: () => mockFn.useParamsMock(),
            useNavigation: () => ({ state: 'idle' }),
        };
    });

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    return {
        useNavigateMock: mockFn.useNavigateMock,
        useParamsMock: mockFn.useParamsMock,
    };
};

export const createLocalStorageMock = () => {
    const getLocalStorage = vi.fn();
    const setLocalStorage = vi.fn();
    const removeLocalStorage = vi.fn();

    Storage.prototype.getItem = getLocalStorage;
    Storage.prototype.setItem = setLocalStorage;
    Storage.prototype.removeItem = removeLocalStorage;

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    return {
        getLocalStorage: getLocalStorage,
        setLocalStorage: setLocalStorage,
        removeLocalStorage: removeLocalStorage,
    };
};

export async function selectItem(container: HTMLElement, choice: string): Promise<void> {
    await userEvent.click(container);
    const countryList = screen.getByRole('listbox');
    await userEvent.click(within(countryList).getByText(choice));
}

export async function selectItemAutoComplete(container: HTMLElement, choice: string): Promise<void> {
    await userEvent.click(container);
    const countryList = screen.getByTestId('stringee-autocomplete-options-list');
    await userEvent.click(within(countryList).getByText(choice));
}

export const getI18nText = ({ i18nKey, values }: { i18nKey: string; values?: Record<string, number | string> }) => {
    return `${i18nKey}${values ? ` ${JSON.stringify(values)}` : ''}`;
};

export const createI18nMock = () => {
    vi.mock('react-i18next', async () => ({
        ...(await vi.importActual('react-i18next')),
        Trans: ({ i18nKey, values }: { i18nKey: string; values?: Record<string, number | string> }) => {
            return getI18nText({ i18nKey, values });
        },
    }));
};

export const resizeWindow = (x: number, y: number) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event('resize'));
};
