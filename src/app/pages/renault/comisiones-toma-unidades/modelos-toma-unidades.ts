import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaTomaUnidades : ColumnaTabla[] = [
    { campo: "vendedor",              etiqueta: "Vendedor", bold: true},
    { campo: "clave_inventario",         etiqueta: "Numero de inventario"},
    { campo: "fecha_toma",            etiqueta: "Fecha Toma", pipe: "date" },
    { campo: "comision_apv_pesos",    etiqueta: "Importe", pipe: "currency",   align:'right', bold: true},
    { campo: "observaciones",         etiqueta: "Observaciones" },
    // { campo: "porcentaje_asesor",     etiqueta: "%",                pipe: "percent",    align:'right' },
    { campo: "estatusTexto",          etiqueta: "Estatus",          textColor:'primary',align:'center', bold: true  },
  ];

/** configuracion de estados del filtro */
export const configEstadosTomaUnidades  = [
    { value: 1,     label: 'Por autorizar' },
    { value: 2,     label: 'Autorizada' },
    { value: 3,     label: 'Pagado' },
    { value: 4,     label: 'Rechazada' },
    // { value: 5,     label: 'Pagados' },
    { value: 12345, label: 'Todos' },
];

export const configuracionesAceessLevelTU = [
    {
        permiso : 'admnin',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : 'todos'
    },{
        permiso : 'cxc',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '1'
    },{
        permiso : 'gventas',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
         estadoDefault : '1'
    },
    {
        permiso : 'conta',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '2'
    },
    {
        permiso : 'rh',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '3'
    },

]