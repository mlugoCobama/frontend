export interface AgenciasNissan {
  // id : number,
  // nombre : string,
  // fecha : Date,
  // uno : number,
  // gasto : number,
  // ventas : number,
  // venta_litros : number,
  // utilidad_bruta : number,
  // personal? : number,
  // ubo : number,
  // eficiencia? : number,
    id : number,
    planta: string;
    estacion: string;
    fecha: Date;
    uno: number;
    gasto: number;
    personal:number;
    cnuevos: number;
    cflotillas: number;
    refacciones: number;
    bajio: number;
    intercias: number;
    plan_piso: number;
    plan_piso_interes: number;
    nrf: number;
    nrf_interes: number;
    servicio: number;
    utilidad_servicio: number;
    hyp: number;
    utilidad_hyp: number;
    nuevos:number;
    utilidad_nuevos: number;
    flotillas:number;
    utilidad_flotillas: number;
    seminuevos: number;
    utilidad_seminuevos: number;
    objetivo: number;
    cumplimiento: number;
    porcentaje: number;
    bono_marca: number;
    bonos: number;
    incentivos: number;
    otros: number;
    descuentos: number;
    area_comercial: number;
    area_postventa: number;

    area_nuevos: number;
    area_seminuevos: number;
    area_flotillas: number;
    area_servicio: number;
    area_refacciones: number;
    area_hyp: number;

    ventas_servicio: number;
    total_ventas_ref: number;
    refacciones_servicio: number;
    refacciones_hyp: number;
    refacciones_mostrador: number;
    inventario_nuevos:number;
    inventario_seminuevos:number;
    inventario_refacciones:number;
    inv_nuevo_101:number;
    inv_nuevo_201:number;
    inv_nuevo_301:number;
    inv_nuevo_401:number;
    inv_semi_101:number;
    inv_semi_201:number;
    inv_semi_301:number;
    inv_semi_401:number;
    personal_ventas:number;
    personal_usados:number;
    personal_refacciones:number;
    personal_servicios:number;
    personal_admin:number;
    personal_apvs:number;
}

export interface ResponseAgenciasNissan {
  success: boolean;
  message: string;
  data: AgenciasNissan[];
}
