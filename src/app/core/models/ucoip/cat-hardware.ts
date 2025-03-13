export interface CatHardware {
    "id": number;
    "tipo": string;
}

export interface ResponseCatHardware {
    "data": CatHardware[];
    "success": boolean;
    "message": string
}