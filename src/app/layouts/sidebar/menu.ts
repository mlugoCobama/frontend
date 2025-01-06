import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
      id: 1,
      label: 'UCoIP',
      icon: 'bx-user',
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
        },
        {
          id: 10,
          label: 'Unidades de Medida',
          link: '/compras/cat-unidades-medidas',
          parentId: 7
        },
      ]
    },
    {
      id: 30,
      label: 'Nissan',
      icon: 'bx-customize',
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
    },
    {
      id: 30,
      label: 'Renault',
      icon: 'bx-customize',
      subItems: [
        {
          id: 31,
          label: 'Visor de Citas',
          link: '',
          parentId: 30,
          subItems: [
            {
                id: 35,
                label: 'Azcapotzalco',
                link: '/renault/visor-citas/1',
                parentId: 34
            },
            {
                id: 36,
                label: 'Ecatepec',
                link: '/renault/visor-citas/2',
                parentId: 34
            },
            {
              id: 36,
              label: 'Pachuca',
              link: '/renault/visor-citas/3',
              parentId: 34
            },
            {
              id: 36,
              label: 'Vallejo',
              link: '/renault/visor-citas/4',
              parentId: 34
            },
          ]
        },
        {
            id: 32,
            label: 'Sabana de Control',
            link: '/renault/sabana-control',
            parentId: 30
        },
      ]
    },
    {
      id: 1,
      label: 'Dashboard',
      icon: 'bx-user',
      subItems: [
        {
          id: 2,
          label: 'UcoIP',
          link: '/ucoip',
          parentId: 1
        },
        {
          id: 3,
          label: 'Captura',
          parentId: 1,
          subItems: [
            {
              id: 35,
              label: 'Captura Gaseras',
              link: '/dashboard/captura/gaseras',
              parentId: 34
            },
            {
              id: 36,
              label: 'Captura Gasolinerias',
              link: '/dashboard/captura/gasolinerias',
              parentId: 34
            },
          ]
        },
      ]
    },
];

