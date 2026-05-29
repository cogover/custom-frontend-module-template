import { faHome } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink, Tooltip } from '@stringeecom/ui-kit';
import icons from 'src/assets/icons.ts';
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n.ts';
import { routeMapFullPath } from 'src/router/routeMap.ts';
import { redirectExternalUrl } from 'src/utils/appUtils.ts';
import { cxBind } from 'src/utils/cx.ts';
import { useAppSelector } from '../../store/hooks';
import { SidebarMenuItem } from '../components/type.ts';
import ResizableDivResizer from './ResizableDivResizer.tsx';

import styles from '../styles/LeftToolbar.module.scss';

const cxModule = cxBind(styles);

export default function LeftToolbar() {
    const { t: tApp } = useTranslation(I18nNS.APP);
    const commonSettings = useAppSelector((state) => state.commonSettings);

    const menuItems: SidebarMenuItem[] = [
        {
            key: 'homepage',
            icon: <FontAwesomeIcon icon={faHome} />,
            title: tApp('wwTranslation.Home'),
            linkTo: routeMapFullPath.index,
        },
    ];

    return (
        <>
            <div
                className={cxModule(
                    'left-toolbar',
                    'z-[30]',
                    {
                        'menu-expand': commonSettings.leftMenuIsExpand,
                        '!bg-primary-light-96': commonSettings.leftMenuIsExpand,
                    },
                    { 'menu-collapse': !commonSettings.leftMenuIsExpand },
                )}
            >
                <div className={cxModule('content')}>
                    <Link className={cxModule('logo')} to={routeMapFullPath.index}>
                        <div className={cxModule('left')}>
                            <img alt='NBT Logo' src={icons.logo} />
                        </div>
                        <div className={cxModule('text', 'text-typo-primary')}>Cogover</div>
                    </Link>

                    {menuItems
                        .filter((item) => !item.hidden)
                        .map((menuItem) => (
                            <Tooltip offset={[0, 20]} key={menuItem.key} content={menuItem.title} placement='right'>
                                {menuItem.externalLink ? (
                                    <div
                                        className={cxModule('menu-item')}
                                        data-testid={`menu-item`}
                                        onClick={() =>
                                            redirectExternalUrl(menuItem.externalLink ? menuItem.externalLink : '')
                                        }
                                    >
                                        <span className={cxModule('icon')}>{menuItem.icon}</span>
                                        <span className={cxModule('text')}>{menuItem.title}</span>
                                    </div>
                                ) : (
                                    <NavLink
                                        className={({ isActive }) => cxModule('menu-item', { active: isActive })}
                                        to={menuItem.linkTo ? menuItem.linkTo : ''}
                                        data-testid={`menu-item`}
                                    >
                                        <span className={cxModule('icon')}>{menuItem.icon}</span>
                                        <span className={cxModule('text')}>{menuItem.title}</span>
                                    </NavLink>
                                )}
                            </Tooltip>
                        ))}
                </div>
            </div>

            <ResizableDivResizer />
        </>
    );
}
