import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaTomaUnidades : ColumnaTabla[] = [
    { campo: "no_vendedor",                     etiqueta: "#",   bold: true, textNoWrap: true, sticky: true, width:41},
    { campo: "vendedor",                etiqueta: "Vendedor",   bold: true, textNoWrap: true, sticky: true, width:240},
    { campo: "por_inventario",          etiqueta: "Inventario"},
    { campo: "fecha_toma",              etiqueta: "Fecha Toma", pipe: "date" },
    { campo: "vehiculo",                etiqueta: "Vehiculo", textNoWrap: true},
    { campo: "numero_serie",            etiqueta: "Numero de serie"},
    { campo: "comision_apv_pesos",      etiqueta: "Importe",    pipe: "currency",   align:'right', bold: true},
    { campo: "tipo_apv",                etiqueta: "Tipo APV", bold: true},
    { campo: "observaciones",           etiqueta: "Observaciones" },
    { campo: "estatusTexto",            etiqueta: "Estatus",    textColor:'primary',align:'center', bold: true , textNoWrap: true },
  ];

/** configuracion de estados del filtro */
export const configEstadosTomaUnidades  = [
    { value: 12345, label: 'Todos' },
    { value: 1,     label: 'Por autorizar' },
    { value: 2,     label: 'En Espera' },
    { value: 3,     label: 'Autorizada' },
    { value: 4,     label: 'Pagada' },
    { value: 0,     label: 'Rechazada' },
    // { value: 5,     label: 'Pagados' },
];

export const configuracionesAceessLevel = [
    {
        permiso : 'view toma unidad like admin',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '12345'
    },{
        permiso : 'view toma unidad nivel 1',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '1'
    },{
        permiso : 'view toma unidad nivel 2',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
         estadoDefault : '2'
    },
    {
        permiso : 'view toma unidad nivel 3',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '3'
    },
    {
        permiso : 'view toma unidad nivel 4',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '4'
    },
];