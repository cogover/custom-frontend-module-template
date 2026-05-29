import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { appStore } from 'src/store';

function ReduxProvider({ children }: PropsWithChildren) {
    return <Provider store={appStore}>{children}</Provider>;
}

export default ReduxProvider;
