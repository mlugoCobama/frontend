export interface TestigoFotografico {
  id?: number;
  imagen: string;
  categoria?: string;
  media_type: 'image' | 'video';
  nombre: string;
  file?: File;
  descripcion?: string;
}

export interface LocalPreview {
  url: string;
  file: File;
  type: string;
  category?: string;
}
