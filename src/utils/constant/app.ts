export const APP_NAME = 'Cogover' as string;
export const DOMAIN_NAME = '.cogover.com' as string;

export type DevelopmentMode = 'development' | 'production' | 'test';
export const DEVELOPMENT_MODE = import.meta.env.MODE as DevelopmentMode;

export const SITE_DOMAIN = import.meta.env.VITE_SITE_DOMAIN as string;
export const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY as string;
