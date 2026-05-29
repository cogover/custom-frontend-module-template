import { faEquals, faNotEqual } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectOperatorOption } from '@stringeecom/ui-kit';
import { t } from 'src/languages/global';

export enum DefaultSelectOperators {
    Equal = 'equal',
    NotEqual = 'not_equal',
}

export const DEFAULT_OPERATOR_OPTIONS: SelectOperatorOption[] = [
    {
        icon: <FontAwesomeIcon icon={faEquals} />,
        label: t('common:common.equals'),
        value: DefaultSelectOperators.Equal,
    },
    {
        icon: <FontAwesomeIcon icon={faNotEqual} />,
        label: t('common:common.notEquals'),
        value: DefaultSelectOperators.NotEqual,
    },
];
