import { CatHardware } from "./cat-hardware";

export interface Inventario {
    id?: number,
    marca: string;
    modelo: string;
    no_serie: string;
    mac: string;
    tipo_cpu: string;
    disco_duro: string;
    memoria_ram: string;
    procesador: string;
    caracteristicas: string;
    observaciones: string;
    estado: number;
    tipo?: CatHardware,
    cat_hardware_id?: number
    usuario_actual?: string
}

export interface ResponseInvetario {
    data: Inventario[];
    success: boolean;
    message: string
}