export interface VehiculoDispersion {
  idSolicitud: number;
  id_asignacion: number;
  idExhibicion: number;
  idAsignacion: number;
  eco: string;
  marca_vehiculo: string;
  submarca: string;
  modelo: string;
  placas: string;
  ventasLitros: number;
  numTarjetaToka: string;
  distanciaRecorrida: number;
  saldoSolicitado: number;
  saldoAutorizado: number;
  saldoMesActual: number;
  saldoActual: number;
  guardada?:any;
  notificada?:any;
  dispersada?:any;
  fechaDispersion?:any;
}

export interface DispersionData {
  fechaDispersion?: any;
  numero_exhibicion: number;
  guardada?: number;
  notificada?: number;
  vehiculos: VehiculoDispersion[];
}
