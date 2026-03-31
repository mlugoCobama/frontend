import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaSeguro : ColumnaTabla[] = [
    { campo: "vendedor",              etiqueta: "Vendedor", bold: true},
    { campo: "folio",                 etiqueta: "Folio", bold: true},
    { campo: "poliza",                etiqueta: "Poliza", bold: true},
    { campo: "fecha_emision",         etiqueta: "Fecha de Emision", pipe: "date"},
    { campo: "prima_neta",            etiqueta: "Prima Neta", pipe: "currency",   align:'right'},
    { campo: "comision_apv_pesos",    etiqueta: "Comision APV",     pipe: "currency",   align:'right', bold: true},
    { campo: "observaciones",         etiqueta: "Observaciones" },
    // { campo: "porcentaje_asesor",     etiqueta: "%",                pipe: "percent",    align:'right' },
    { campo: "estatusTexto",          etiqueta: "Estatus",          textColor:'primary',align:'center', bold: true  },
  ];

/** configuracion de estados del filtro */
export const configEstadosSeguro  = [
    { value: 1,     label: 'Por autorizar' },
    { value: 2,     label: 'Autorizada' },
    { value: 3,     label: 'Pagado' },
    { value: 4,     label: 'Rechazada' },
    // { value: 5,     label: 'Pagados' },
    { value: 12345, label: 'Todos' },
];

export const configuracionesAceessLevel = [
    {
        permiso : 'view seguros like admin',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '12345'
    },{
        permiso : 'view seguros like nivel 1',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '1'
    },{
        permiso : 'view seguros like nivel 2',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
         estadoDefault : '2'
    },
    {
        permiso : 'view seguros like nivel 3',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '3'
    },
    {
        permiso : 'view seguros like nivel 4',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '4'
    },
];