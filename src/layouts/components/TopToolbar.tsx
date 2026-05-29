import { faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AvatarField, Link, Popper, PopperRef, Typography } from '@stringeecom/ui-kit';
import { Fragment, useRef, useState } from 'react';
import icons from 'src/assets/icons';
import { useAppSelector } from 'src/store/hooks';
import { cxBind } from 'src/utils/cx';
import InactiveBanner from './InactiveBadge';
import UserMenu from './menu/UserMenu';

import styles from '../styles/TopToolbar.module.scss';

const cxModule = cxBind(styles);

interface Props {
    title?: string;
    showLogo?: boolean;
    className?: string;
    logoLink?: string;
    showWorkspaceName?: boolean;
}

export default function TopToolbar({
    title = '',
    className,
    showLogo = false,
    logoLink = '#',
    showWorkspaceName = true,
}: Readonly<Props>) {
    const userMenuPopper = useRef<PopperRef>(null);

    const account = useAppSelector((state) => state.commonSettings.account);
    const personnelId = useAppSelector((state) => state.commonSettings.workspaceAccount?.personnelId);
    // const themeMode = useSelectTheme();

    const { workspace } = useAppSelector((state) => state.commonSettings);

    // const [isOpenAllAppsMenu, setIsOpenAllAppsMenu] = useState(false);
    // const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

    // const buttonClassName = cxModule(
    //     'w-[32px] h-[32px]',
    //     'inline-flex justify-center items-center',
    //     'rounded-full',
    //     'text-typo-primary',
    //     'outline-none',
    //     {
    //         'hover:bg-primary-light-90 focus-visible:bg-primary-light-90': themeMode === ThemeType.light,
    //         'hover:bg-primary-light-80 focus-visible:bg-primary-light-80': themeMode === ThemeType.dark
    //     }
    // );

    // const buttonActiveClassName = cxModule('!text-primary-main', '!bg-primary-light-80');

    // Use Cogover Websocket

    return (
        <div>
            <nav className={cxModule('top-toolbar', className)}>
                <Link to={logoLink} className={cxModule('left', 'block text-[unset]')}>
                    {showLogo && <img src={icons.logo} alt='Cogover' />}
                    <div className={cxModule('flex gap-5 items-center')}>
                        {showWorkspaceName && (
                            <Fragment>
                                <Typography variant='subtitle1'>
                                    {workspace?.name ? workspace.name : workspace?.domain}
                                </Typography>
                                <div className={cxModule('w-[1px] h-[22px] bg-divider-primary')}></div>
                            </Fragment>
                        )}
                        <Typography variant='body1'>{title}</Typography>
                    </div>
                </Link>
                <button className={cxModule('hidden mobile:!inline-block')}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <div className={cxModule('right', 'mobile:!hidden')}>
                    {/* <Popper
                        placement='bottom-end'
                        offset={[0, 10]}
                        render={({ attributes, ...params }) => (
                            <div
                                {...attributes}
                                {...params}
                                className={cxModule('z-[20]', 'shadow-popover', 'border border-divider-primary')}
                            >
                                <Notification />
                            </div>
                        )}
                        onShow={() => setIsOpenNotification(true)}
                        onHide={() => setIsOpenNotification(false)}
                    >
                        {(params) => (
                            <button
                                {...params}
                                className={cxModule(buttonClassName, {
                                    [buttonActiveClassName]: isOpenNotification
                                })}
                            >
                                <FontAwesomeIcon icon={faBellRing} className={cxModule('h-[18px]')} />
                            </button>
                        )}
                    </Popper>
                    <Popper
                        placement='bottom-end'
                        offset={[0, 10]}
                        render={({ attributes, ...params }) => (
                            <div
                                {...attributes}
                                {...params}
                                className={cxModule('z-[20]', 'shadow-popover', 'border border-divider-primary')}
                            >
                                <AllAppsMenu />
                            </div>
                        )}
                        onShow={() => setIsOpenAllAppsMenu(true)}
                        onHide={() => setIsOpenAllAppsMenu(false)}
                    >
                        {(params) => (
                            <button
                                {...params}
                                className={cxModule(buttonClassName, {
                                    [buttonActiveClassName]: isOpenAllAppsMenu
                                })}
                            >
                                <FontAwesomeIcon icon={faGridRound2} className={cxModule('h-[16px]')} />
                            </button>
                        )}
                    </Popper>

                    <button className={cxModule(buttonClassName)}>
                        <FontAwesomeIcon icon={faCircleQuestion} className={cxModule('h-[18px]')} />
                    </button> */}

                    <Popper
                        placement='bottom-end'
                        ref={userMenuPopper}
                        appendTo={{
                            current: document.body,
                        }}
                        offset={[0, 10]}
                        onShow={() => setIsOpenUserMenu(true)}
                        onHide={() => setIsOpenUserMenu(false)}
                        render={({ attributes, ...params }) => (
                            <div
                                {...params}
                                {...attributes}
                                className={cxModule('z-[50]', 'shadow-popover', 'border border-divider-primary')}
                            >
                                <UserMenu onClose={() => userMenuPopper.current?.hide()} />
                            </div>
                        )}
                    >
                        {(params) => (
                            <button
                                {...params}
                                className={cxModule(
                                    'relative',
                                    'group',
                                    'w-[32px] h-[32px]',
                                    'flex justify-center items-center',
                                    'rounded-full',
                                    'outline-none focus-visible:bg-primary-light-90',
                                    'hover:bg-primary-light-90',
                                    { 'bg-primary-light-90': isOpenUserMenu },
                                )}
                            >
                                <div
                                    className={cxModule(
                                        'h-[24px] w-[24px] rounded-full',
                                        'absolute top-0 left-0 z-10',
                                        'transition',
                                        // 'group-hover:bg-[rgba(255,255,255,.2)]'
                                    )}
                                />
                                <AvatarField
                                    src={account?.avatar}
                                    resolutionSize='small'
                                    alt={account?.fullName}
                                    id={personnelId}
                                />
                            </button>
                        )}
                    </Popper>
                </div>
            </nav>
            <InactiveBanner />
        </div>
    );
}
