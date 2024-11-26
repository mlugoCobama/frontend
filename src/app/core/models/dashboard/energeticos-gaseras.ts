export interface EnergeticosGaseras {
  id : number,
  nombre : string,
  fecha : Date,
  uno : number,
  gasto : number,
  ventas : number,
  venta_litros : number,
  utilidad_bruta : number,
  personal : number,
  ubo : number,
  eficiencia : number,
}

export interface ResponseEnergeticosGaseras {
  success: boolean;
  message: string;
  data: EnergeticosGaseras[]
}
