import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'UCoIP',
        icon: 'bx-user',
        isCollapsed: false,
        subItems: [
            {
              id: 2,
              label: 'UcoIP',
              link: '/ucoip',
              parentId: 1
            },
            {
              id: 3,
              label: 'Configuración',
              link: '/ucoip/configuracion',
              parentId: 1,
              subItems: [
                {
                    id: 35,
                    label: 'Permisos',
                    link: '/ucoip/configuracion/permisos',
                    parentId: 34
                },
                {
                    id: 36,
                    label: 'Modulos',
                    link: '/ucoip/configuracion/modulos',
                    parentId: 34
                },
              ]
            },
        ]
    },
    {
      id: 7,
      label: 'Compras',
      icon: 'bx-tone',
      isCollapsed: false,
      isUiElement: true,
      subItems: [
        {
          id: 8,
          label: 'Compras',
          link: '/compras',
          parentId: 7
        },
        {
          id: 9,
          label: 'Proveedores',
          link: '/compras/proveedores',
          parentId: 7
        }
      ]
    },
    {
        id: 30,
        label: 'Nissan',
        icon: 'bx-customize',
        isCollapsed: false,
        subItems: [
            {
                id: 31,
                label: 'Pedido Unidades',
                link: '/nissan/pedido-unidades',
                parentId: 30
            },
            {
                id: 32,
                label: 'Compra Seminuevos',
                link: '/nissan/compra-seminuevos',
                parentId: 30
            },

        ]
    }
];

