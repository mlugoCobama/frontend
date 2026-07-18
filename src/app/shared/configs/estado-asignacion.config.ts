import { EstadoAsignacion } from "../Enums/estado-asignacion.enum";

export const EstadoAsignacionConfig = {

    [EstadoAsignacion.ACTIVA]: {
        label: 'Activa',
        color: 'success'
    },

    [EstadoAsignacion.FINALIZADA]: {
        label: 'Finalizada',
        color: 'danger'
    },

    [EstadoAsignacion.INACTIVA]: {
        label: 'Inactiva',
        color: 'dark'
    }

};