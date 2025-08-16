export interface UnidadMedida {
    id: number;
    nombre: string;
    abreviatura: string;
}

export interface ResponseUnidadMedida{
    status: string;
    message: string;
    data: UnidadMedida[];
}
