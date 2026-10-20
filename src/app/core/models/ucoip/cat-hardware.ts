export interface CatHardware {
    "id": number;
    "tipo": string;
    "campos"?: any;
}

export interface ResponseCatHardware {
    "data": CatHardware[];
    "success": boolean;
    "message": string
}