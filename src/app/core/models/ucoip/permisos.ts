export interface Permisos {
    id:number;
    nombre: string;
    descripcion: string;
    name: string;
    permiso_id: number
}

export interface ResponsePermisos {
    data: Permisos[];
    success: boolean;
    message: string
}