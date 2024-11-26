export interface CatEmpresas {
  division: string;
  sub_division: string;
  entidad: string;
  nombre: string;
  id: number;
}

export interface ResponseCatEmpresas {
  success: boolean;
  message: string;
  data: CatEmpresas[]
}
