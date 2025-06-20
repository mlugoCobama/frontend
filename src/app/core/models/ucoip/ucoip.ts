export interface Ucoip {
    area: string,
    area_id:number,
    departamento: string,
    departamento_id:number,
    puesto: string,
    puesto_id:number,
    nombre: string,
    correo: string,
    ucoip: string,
    contrasenia: string
}

export interface responseUcoip {
    data: Ucoip[];
    success: boolean;
    message: string
}

