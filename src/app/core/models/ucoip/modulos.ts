export interface Modulos {
    id?: number,
    nombre: string;
    descripcion: string;
    activo: number;
}


export interface ResponseModulos {
    data: Modulos[];
    success: boolean;
    message: string
}