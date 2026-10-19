import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { moduleStore } from 'src/store';

function ReduxProvider({ children }: PropsWithChildren) {
    return <Provider store={moduleStore}>{children}</Provider>;
}

export default ReduxProvider;
