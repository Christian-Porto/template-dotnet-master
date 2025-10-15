/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [    {
        id: 'events',
        title: 'Eventos',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/events'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: 'admin/users'
            },
            {
                id: 'eventos',
                title: 'Eventos',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: 'admin/events'
            }
        ]
    }];
export const compactNavigation: FuseNavigationItem[] = [    {
        id: 'events',
        title: 'Eventos',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/events'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: 'admin/users'
            },
            {
                id: 'eventos',
                title: 'Eventos',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: 'admin/events'
            }
        ]
    }];
export const futuristicNavigation: FuseNavigationItem[] = [    {
        id: 'events',
        title: 'Eventos',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/events'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: 'admin/users'
            },
            {
                id: 'eventos',
                title: 'Eventos',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: 'admin/events'
            }
        ]
    }];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'events',
        title: 'Eventos',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/events'
    },
    {
        id: 'admin',
        title: 'Admin',
        type: 'group',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: 'admin/users'
            },
            {
                id: 'eventos',
                title: 'Eventos',
                type: 'basic',
                icon: 'heroicons_outline:ticket',
                link: 'admin/events'
            }
        ]
    }
];
