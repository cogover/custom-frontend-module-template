import i18n, { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import Trans from './components/Trans';
import { appStore } from './store';

declare global {
    interface Window {
        appStore?: typeof appStore;
        i18n?: typeof i18n;
        t?: TFunction;
        useTranslation?: typeof useTranslation;
        Trans?: typeof Trans;
    }
}
