import { combineReducers, configureStore } from '@reduxjs/toolkit';
import CommonSettingsStateReducer from './commonSettingsSlice.ts';

const rootReducer = combineReducers({
    commonSettings: CommonSettingsStateReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
}

export const moduleStore = setupStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
