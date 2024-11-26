import { MenuItem } from './menu.model';

export const MENUUCOIP: MenuItem[] = [
    {
        id: 1,
        label: 'UcoIP',
        icon: 'bx-user',
        link: 'ucoip/ucoip',
    },
    {
        id: 2,
        label: 'Configuración',
        icon: 'bx-cog',
        isCollapsed: false,
        subItems: [
            {
                id: 2,
                label: 'Permisos',
                link: '/',
                parentId: 2
            },
        ]
    },
];

