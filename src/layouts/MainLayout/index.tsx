import { useTranslation } from 'src/languages/global';
import { Outlet, useSearchParams } from 'react-router-dom';
import { cxBind } from 'src/utils/cx.ts';
import { useAppSelector } from '../../store/hooks';
import { InactiveBadgeSpace } from '../components/InactiveBadge.tsx';
import LeftToolbar from '../components/LeftToolbar.tsx';
import TopToolbar from '../components/TopToolbar.tsx';

import { IS_HIDE_MAIN_LAYOUT } from 'src/utils/constant/searchParams.ts';
import styles from '../styles/index.module.scss';

const cxModule = cxBind(styles);

export default function MainLayout() {
    const leftMenuIsExpand = useAppSelector((state) => state.commonSettings.leftMenuIsExpand);
    const { t } = useTranslation('app');

    const root = document.documentElement;
    if (!leftMenuIsExpand) {
        root.style.setProperty('--left-toolbar-width', '60px');
    } else {
        const current = root.style.getPropertyValue('--left-toolbar-width');
        if (!current) {
            root.style.setProperty('--left-toolbar-width', '240px');
        }
    }

    // const { pathname } = useLocation();

    const [searchParams] = useSearchParams();

    // nhúng Cogover vào StringeeX
    const isEmbedded = window.location.pathname.startsWith('/c/');
    const isHideMainLayout = searchParams.get(IS_HIDE_MAIN_LAYOUT) === 'true';

    if (!!isEmbedded || isHideMainLayout) {
        root.style.setProperty('--left-toolbar-width', '0px');
        root.style.setProperty('--top-toolbar-width', '0px');
    }

    return (
        <div>
            {!isEmbedded && !isHideMainLayout && <LeftToolbar />}
            <div className={cxModule('main-page')}>
                {!isEmbedded && !isHideMainLayout && (
                    <div className={cxModule('header')}>
                        <TopToolbar
                            logoLink={window.location.origin}
                            title={t('commonValidationMessages.commonPageTitle')}
                        />
                    </div>
                )}
                <div className={cxModule('main-page-content')}>
                    <InactiveBadgeSpace />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
