import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaFinanciamiemto : ColumnaTabla[] = [
    { campo: "vendedor", etiqueta: "Vendedor", bold: true, textNoWrap:true, sticky:true, width:280},
    { campo: "razon_social", etiqueta: "Cliente", bold: true, textNoWrap:true},
    { campo: "no_factura",        etiqueta: "No.Factura" },
    { campo: "fecha_factura",        etiqueta: "Fecha", pipe:'date' },
    { campo: "sub_total_factura", etiqueta: "Sub Total",     pipe: "currency",   align:'right', bold:true},
    { campo: "iva", etiqueta: "IVA",     pipe: "currency",   align:'right'},
    { campo: "total", etiqueta: "Total",     pipe: "currency",   align:'right'},
    { campo: "comision_apv_pesos", etiqueta: "Comisión",     pipe: "currency",   align:'right', bold: true},
    { campo: "observaciones",         etiqueta: "Observaciones" },
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
        permiso : 'view accesorios like admin',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '12345'
    },{
        permiso : 'view accesorios like nivel 1',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '1'
    },{
        permiso : 'view accesorios like nivel 2',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
         estadoDefault : '2'
    },
    {
        permiso : 'view accesorios like nivel 3',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '3'
    },
    {
        permiso : 'view accesorios like nivel 4',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '4'
    },
]