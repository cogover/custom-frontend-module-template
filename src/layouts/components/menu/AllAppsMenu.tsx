import { Avatar } from '@stringeecom/ui-kit';

import icons from 'src/assets/icons';
import cx from 'src/utils/cx';
import MenuGroup from './MenuGroup';

export default function AllAppsMenu() {
    return (
        <div className={cx('w-[400px] px-3 py-4', 'bg-background-default')}>
            <div className={cx('flex items-center gap-[14px]', 'p-[0_0.5rem]')}>
                <img src={icons.logo} className={cx('w-[26px]')} />
                <p className={cx('text-typo-primary text-[1.125rem] font-[700]')}>Next big thing</p>
            </div>

            <div className={cx('flex flex-col gap-[12px]', 'mt-[8px]', 'text-primary-main')}>
                <MenuGroup
                    title='Switch to'
                    items={[
                        {
                            icon: (
                                <Avatar
                                    className={cx('w-[20px] h-[20px]')}
                                    src={icons.appIcons.humanResourceManagement}
                                />
                            ),
                            title: 'Human Resources Management',
                        },
                        {
                            icon: (
                                <Avatar
                                    className={cx('w-[20px] h-[20px]')}
                                    src={icons.appIcons.operateInternalOperations}
                                />
                            ),
                            title: 'Operate internal operations',
                        },
                        {
                            icon: (
                                <Avatar className={cx('w-[20px] h-[20px]')} src={icons.appIcons.financialManagement} />
                            ),
                            title: 'Financial management',
                        },
                    ]}
                />

                <MenuGroup
                    title='Recommend app for your organization'
                    items={[
                        {
                            icon: <Avatar className={cx('w-[20px] h-[20px]')} src={icons.appIcons.processManagement} />,
                            title: 'Process management',
                        },
                        {
                            icon: <Avatar className={cx('w-[20px] h-[20px]')} src={icons.appIcons.assetManagement} />,
                            title: 'Asset Management',
                        },
                    ]}
                />

                <MenuGroup title='All Next Big Think App' linkTo='#' />
            </div>
        </div>
    );
}
