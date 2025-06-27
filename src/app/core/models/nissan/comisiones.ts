export interface Comision {
    fecha_factura: Date;
    fecha_cancelacion: Date;
    faau_vend_clave: string;
    faau_nofactura:string;
    faau_razonfactura:string;
    vehi_clas_clave:string;
    vehi_anio:number;
    vehi_numeroinventario:number;
    vehi_serie:string;
    mode_clave:string;
    mode_descripcion:string;
    saau_folio:string;
    fecha_salida:Date;
    faau_form_TipoVenta:string;
    saau_vehi_vehiculoid:number;
    faau_iva:number;
    faau_total:number;
    Venta:number;
    Costo:number;
    vehi_OtrosCarCont:number;
    bonificacion:number;
    Utilidad:number;
    otros:number;
    gasolina:number;
    previa:number;
    descuentos:number;
    traslados:number;
    descuento_impulso:number;
    total_subsidios:number;
    descuento_gastos:number;
    cortesia:number;
    accesorios:number;
    placas:number;
    isNew:boolean;
}

export interface ResponseComision {
  status: boolean;
  message: string;
  data: Comision[]
}
