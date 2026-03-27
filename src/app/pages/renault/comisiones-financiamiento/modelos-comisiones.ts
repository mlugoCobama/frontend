import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaFinanciamiemto : ColumnaTabla[] = [
    { campo: "vendedor", etiqueta: "Vendedor", bold: true},
    { campo: "no_contrato",           etiqueta: "No. Contrato", bold: true},
    { campo: "fecha_desembolso",      etiqueta: "Fecha Desembolso", pipe: "date" },
    { campo: "monto_financiar",       etiqueta: "Monto Financiado", pipe: "currency",   align:'right'},
    { campo: "incentivo_dealer",      etiqueta: "Incentivo Dealer", pipe: "currency",   align:'right'},
    { campo: "comision_asesor_pesos", etiqueta: "Comision APV",     pipe: "currency",   align:'right', bold: true},
    { campo: "numero_factura",        etiqueta: "No.Factura" },
    { campo: "observaciones",         etiqueta: "Observaciones" },
    // { campo: "porcentaje_asesor",     etiqueta: "%",                pipe: "percent",    align:'right' },
    { campo: "estatusTexto",           etiqueta: "Estatus",          textColor:'primary',align:'center', bold: true  },
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