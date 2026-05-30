export const APP_NAME = 'Cogover' as string;
export const DOMAIN_NAME = '.cogover.com' as string;

export type DevelopmentMode = 'development' | 'production' | 'test';
export const DEVELOPMENT_MODE = import.meta.env.MODE as DevelopmentMode;
