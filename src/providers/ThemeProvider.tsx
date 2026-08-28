import { PropsWithChildren, useEffect } from 'react';
import { useSelectTheme } from 'src/store/commonSettingsSlice';

import { ThemeType } from 'src/theme/theme.type';

function ThemeProvider({ children }: PropsWithChildren) {
    const themeMode = useSelectTheme() ?? ThemeType.light;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    return <>{children}</>;
}

export default ThemeProvider;
