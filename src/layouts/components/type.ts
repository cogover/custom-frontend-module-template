import React from 'react';

export interface SidebarMenuItem {
    key: React.Key;
    icon: React.ReactNode;
    title: string;
    linkTo?: string;
    externalLink?: string;
    hidden?: boolean;
}
