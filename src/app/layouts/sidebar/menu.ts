import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
      id: 1,
      label: 'UCoIP',
      icon: 'bx-user',
      permission: 'view modulo ucoip',
      subItems: [
        {
          id: 2,
          label: 'UcoIP',
          link: '/ucoip',
          parentId: 1,
          permission: 'view ucoip'
        },
        {
          id: 2,
          label: 'Inventario',
          link: '/ucoip/inventario',
          parentId: 1,
          permission: 'view inventario'
        },
        {
          id: 3,
          label: 'Configuración',
          link: '/ucoip/configuracion',
          parentId: 1,
          permission: 'view configuracion',
          subItems: [
            {
                id: 35,
                label: 'Permisos',
                link: '/ucoip/configuracion/permisos',
                parentId: 34,
                permission: 'view permisos'
            },
            {
                id: 36,
                label: 'Modulos',
                link: '/ucoip/configuracion/modulos',
                parentId: 34,
                permission: 'view modulos'
            },
          ]
        },
      ]
    },
    {
      id: 7,
      label: 'Compras',
      icon: 'bx-tone',
      permission: 'view modulo compras',
      subItems: [
        {
          id: 8,
          label: 'Compras',
          link: '/compras',
          parentId: 7,
          permission: 'view compras',
        },
        {
          id: 12,
          label: 'Compras Macro taller',
          link: '/compras/compras-macro',
          parentId: 7,
          permission: 'view compras macro taller',
        },
        {
          id: 9,
          label: 'Proveedores',
          link: '/compras/proveedores',
          parentId: 7,
          permission: 'view proveedores',
        },
        {
          id: 10,
          label: 'Unidades de Medida',
          link: '/compras/cat-unidades-medidas',
          parentId: 7,
          permission: 'view unidades de medida',
        },
      ]
    },
    {
      id: 7,
      label: 'Macro Taller',
      icon: 'bx-wrench',
      permission: 'view compras macro taller',
      subItems: [
        {
          id: 11,
          label: 'Parque Vehicular',
          link: '/compras/cat-unidades',
          parentId: 7,
          permission: 'view compras macro taller',
        },
        {
          id: 8,
          label: 'Técnicos',
          link: '/macro/tecnicos',
          parentId: 7,
          permission: 'view compras macro taller',
        },
        {
          id: 12,
          label: 'Almacén',
          link: '/macro/almacen',
          parentId: 7,
          permission: 'view compras macro taller',
        },
      ]
    },
    {
      id: 30,
      label: 'Nissan',
      icon: 'bx-customize',
      permission: 'view modulo nissan',
      subItems: [
        {
            id: 31,
            label: 'Pedido Unidades',
            link: '/nissan/pedido-unidades',
            parentId: 30,
            permission: 'view pedido unidades',
        },
        {
            id: 32,
            label: 'Compra Seminuevos',
            link: '/nissan/compra-seminuevos',
            parentId: 30,
            permission: 'view compra seminuevos',
        },
        {
            id: 32,
            label: 'Comisiones',
            link: '/nissan/comisiones',
            parentId: 30,
            permission: 'view comisiones',
        },

      ]
    },
    {
      id: 30,
      label: 'Renault',
      icon: 'bx-customize',
      permission: 'view modulo renault',
      subItems: [
        {
          id: 31,
          label: 'Visor de Citas',
          link: '',
          parentId: 30,
          permission: 'view visor citas',
          subItems: [
            {
                id: 35,
                label: 'Azcapotzalco',
                link: '/renault/visor-citas/1',
                permission: 'view visor citas azcapotzalco',
                parentId: 34
            },
            {
                id: 36,
                label: 'Ecatepec',
                link: '/renault/visor-citas/2',
                permission: 'view visor citas ecatepec',
                parentId: 34
            },
            {
              id: 36,
              label: 'Pachuca',
              link: '/renault/visor-citas/3',
              permission: 'view visor citas pachuca',
              parentId: 34
            },
            {
              id: 36,
              label: 'Vallejo',
              link: '/renault/visor-citas/4',
              permission: 'view visor citas vallejo',
              parentId: 34
            },
          ]
        },
        {
            id: 32,
            label: 'Sabana de Control',
            link: '/renault/sabana-control',
            permission: 'view sabana control',
            parentId: 30
        },
      ]
    },
    {
      id: 1,
      label: 'Dashboard',
      icon: 'bx-user',
      permission: 'view modulo dashboard',
      subItems: [
        {
          id: 4,
          label: 'Gaseras',
          link: '/dashboard/landing-page/energeticos',
          permission: 'view landing energeticos',
          parentId: 1
        },
        
        {
          id: 5,
          label: 'Gasolinerias',
          link: '/dashboard/landing-page/gasolinerias',
          permission: 'view landing gasolinerias',
          parentId: 1
        },
        {
          id: 6,
          label: 'Nissan',
          link: '/dashboard/landing-page/nissan',
          permission: 'view landing nissan',
          parentId: 1
        },
        {
          id: 7,
          label: 'Renault',
          link: '/dashboard/landing-page/reanult',
          permission: 'view landing reanult',
          parentId: 1
        },
        {
          id: 3,
          label: 'Captura',
          parentId: 1,
          permission: 'view captura',
          subItems: [
            {
              id: 35,
              label: 'Captura Gaseras',
              link: '/dashboard/captura/gaseras',
              permission: 'view captura gaseras',
              parentId: 34
            },
            {
              id: 36,
              label: 'Captura Gasolinerias',
              link: '/dashboard/captura/gasolinerias',
              permission: 'view captura gasolinerias',
              parentId: 34
            },
            {
              id: 37,
              label: 'Captura Nissan',
              link: '/dashboard/captura/agencias-nissan',
              permission: 'view captura nissan',
              parentId: 34
            },
            {
              id: 38,
              label: 'Captura Renault',
              link: '/dashboard/captura/agencias-renault',
              permission: 'view captura renault',
              parentId: 34
            },
          ]
        },
      ]
    },
];

