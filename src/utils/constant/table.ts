export const TABLE_POPPER_DELAY = 800; // MS
export const TABLE_PAGE_SIZE_OPTIONS = [20, 50, 100];
export const SHOW_PAGING_FROM = 20;
export const MAX_TABLE_ROWS = 20;
export const DEFAULT_PAGE_SIZE = 20;

export const TABLE_NAMES = {
    POSITION: 'position',
    WORKFLOW_PROCESS: 'workflow_process',
} as const;

export type TableNameType = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];
