import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaConcentrado : ColumnaTabla[] = [
    { campo: "nro_vendedor_as", etiqueta: "#", bold: true},
    { campo: "vendedor",        etiqueta: "Vendedor", bold: true},
    { campo: "nuevos",          etiqueta: "Nuevos", pipe: "currency",   align:'right'},
    { campo: "seminuevos",      etiqueta: "Seminuevos", pipe: "currency",   align:'right'},
    { campo: "financiamiento",  etiqueta: "Financiamiento", pipe: "currency",   align:'right'},
    { campo: "accesorios",      etiqueta: "Accesorios", pipe: "currency",   align:'right'},
    { campo: "seguros",         etiqueta: "Seguros", pipe: "currency",   align:'right'},
    { campo: "toma_unidades",         etiqueta: "Toma de Unidades", pipe: "currency",   align:'right'},
    { campo: "total",           etiqueta: "Total", pipe: "currency",   align:'right', bold: true},
  ];

/** configuracion de estados del filtro */
export const configEstadosFinanciamiento  = [
    { value: 1,     label: 'Por autorizar' },
    { value: 2,     label: 'Autorizada' },
    { value: 3,     label: 'Pagado' },
    { value: 4,     label: 'Rechazada' },
    // { value: 5,     label: 'Pagados' },
    { value: 12345, label: 'Todos' },
];

export const configuracionesAceessLevel = [
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