export interface EventoCita {
  id: number;
  ren_citas_servicio_id: number;
  ren_cat_eventos_id: number;
  inicio_evento: string;
  fin_evento: string | null;
  observaciones?: string;
}

export interface PasoLineaTiempo {
  idCat: number;
  nombre: string;
  estatus: 'pendiente' | 'en_proceso' | 'completado';
  fecha?: string | null;
  completado: boolean;
  enProceso: boolean;
  mensaje?: string;
}
