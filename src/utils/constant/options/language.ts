import { locales } from 'src/languages/i18n';

export const languageOptions = Object.entries(locales).map(([value, label]) => ({
    label,
    value,
}));
