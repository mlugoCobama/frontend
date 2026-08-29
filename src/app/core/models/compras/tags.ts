export interface TagTelepeaje {
  id?: number;
  proveedor: string;
  marca: string;
  num_tag: string;
  numero_cuenta: string | null;
  serie: string;
  fecha_alta: string | null;
  fecha_venciemiento: string | null;
  saldo_actual: number | null;
  esatus: string;
  estado: string;
  observaciones: string | null;
  intercompania: string;
  empresa: string;
}

export interface MarcaTag {
  marca: number;
  label: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

