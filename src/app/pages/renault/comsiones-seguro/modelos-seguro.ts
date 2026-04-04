import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaSeguro : ColumnaTabla[] = [
    { campo: "no_vendedor",              etiqueta: " # ", bold: true, textNoWrap: true, sticky: true, width:35},
    { campo: "vendedor",              etiqueta: "APV", bold: true, textNoWrap: true, sticky: true, width:240},
    { campo: "folio",                 etiqueta: "Folio", bold: true},
    { campo: "poliza",                etiqueta: "Poliza", bold: true},
    { campo: "aseguradora",                etiqueta: "Aseguradora", bold: true},
    { campo: "nombre",         etiqueta: "Nombre"},
    { campo: "unidad",         etiqueta: "Unidad"},
    { campo: "serie",         etiqueta: "Serie"},
    { campo: "fecha_emision",         etiqueta: "Fecha Emisión", pipe: "date",},
    { campo: "forma_pago",         etiqueta: "Forma de pago"},
    { campo: "prima_neta",            etiqueta: "Prima Neta", pipe: "currency",   align:'right', bold: true , borderEnd: true, borderStart: true},
    { campo: "vs",            etiqueta: "VS", pipe: "currency",   align:'right'},
    { campo: "comision_apv_pesos",    etiqueta: "Comision APV",     pipe: "currency",   align:'right', bold: true, borderEnd: true, borderStart: true},
    { campo: "com_encargado_seg",            etiqueta: "Com. Encargado Seg.", pipe: "currency",   align:'right'},
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