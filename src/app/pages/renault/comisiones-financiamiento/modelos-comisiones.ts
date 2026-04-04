import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
/** Configuracion de columnas de la tabla generica */
export const configTablaFinanciamiemto : ColumnaTabla[] = [
    { campo: "no_vendedor",                     etiqueta: "#",                      bold: true, sticky: true, width:41},
    { campo: "vendedor",                        etiqueta: "APV",                    bold: true, textNoWrap:true, sticky: true, width:240},
    { campo: "no_contrato",                     etiqueta: "No. Contrato",           bold: true},
    { campo: "numero_factura",                  etiqueta: "No.Factura" },
    { campo: "cliente",                         etiqueta: "Cliente",                textNoWrap:true},
    { campo: "vehiculo",                        etiqueta: "Unidad",                 textNoWrap:true },
    { campo: "serie",                           etiqueta: "Serie" },
    { campo: "fecha_desembolso",                etiqueta: "Fecha Desembolso",       pipe: "date" },
    { campo: "monto_financiar",                 etiqueta: "Monto Financiado",       pipe: "currency", bold: true,  align:'right', borderEnd: true, borderStart: true},
    { campo: "kit_seguridad",                   etiqueta: "Kit Seguridad",          pipe: "currency",   align:'right'},
    { campo: "sat_finder",                      etiqueta: "SAT Finder",             pipe: "currency",   align:'right', borderEnd: true, borderStart: true},
    { campo: "garantia_extendida",              etiqueta: "Garantía Ext.",          pipe: "currency",   align:'right'},
    { campo: "seguro_vf3",                      etiqueta: "Seguro VF3",             pipe: "currency",   align:'right', borderEnd: true, borderStart: true},
    { campo: "accesorios_adicionales",          etiqueta: "Accesorios adic.",       pipe: "currency",   align:'right'},
    { campo: "incentivo_dealer",                etiqueta: "Incentivo Dealer",       pipe: "currency",   align:'right', borderEnd: true, borderStart: true},
    { campo: "comision_asesor_pesos",           etiqueta: "Comision al Asesor",     pipe: "currency",   align:'right', bold: true},
    { campo: "comision_mantenimiento",          etiqueta: "Com. Mantenimiento",     pipe: "currency",   align:'right', borderEnd: true, borderStart: true},
    { campo: "comision_garantia_extendida",     etiqueta: "Com. Garantía Ext.",     pipe: "currency",   align:'right'},
    { campo: "comision_udi",                    etiqueta: "Comision de UDI",        pipe: "currency",   align:'right', borderEnd: true, borderStart: true},
    { campo: "comision_vf3",                    etiqueta: "Comision VF3",           pipe: "currency",   align:'right'},
    { campo: "observaciones",                   etiqueta: "Observaciones" ,         borderEnd: true, borderStart: true},
    { campo: "sub_x_des",                       etiqueta: "T.Subsidios X Desem.",   pipe: "currency",   align:'right'},
    { campo: "estatusTexto",                    etiqueta: "Estatus",                textColor:'primary',align:'center', bold: true, textNoWrap:true  },
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
        permiso : 'view financiamientos like admin',
        configFiltro :{ showEstado: true, showVendedor: true, showTipoVenta: false},
        estadoDefault : '12345'
    },{
        permiso : 'view financiamientos like nivel 1',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '1'
    },{
        permiso : 'view financiamientos like nivel 2',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
         estadoDefault : '2'
    },
    {
        permiso : 'view financiamientos like nivel 3',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '3'
    },
    {
        permiso : 'view financiamientos like nivel 4',
        configFiltro :{ showEstado: false, showVendedor: true, showTipoVenta: false},
        estadoDefault : '4'
    },
]