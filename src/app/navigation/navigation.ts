import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'home',
                title    : 'home',
                translate: 'NAV.HOME.TITLE',
                type     : 'item',
                icon     : 'home',
                url      : '/home',
            }
        ]
    },
    {
        id       : 'shippments',
        title    : 'Shippments',
        translate: 'NAV.SHIPPMENTS',
        type     : 'item',
        icon     : 'list',
        url      : '/shipments',
        hidden   : false,
    },
    {
        id       : 'users',
        title    : 'Users',
        hidden   : false,
        translate: 'NAV.USERS',
        type     : 'item',
        icon     : 'people_alt',
        url      : '/users',
    },
];
