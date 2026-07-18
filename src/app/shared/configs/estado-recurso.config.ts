import { EstadoRecurso } from "../Enums/estado-recurso.enum";

export const EstadoRecursoConfig = {
    [EstadoRecurso.NO_ASIGNABLE]: {
        label: 'No asignable',
        color: 'secondary',
        icon: 'fas fa-ban'
    },
    [EstadoRecurso.DISPONIBLE]: {
        label: 'Disponible',
        color: 'success',
        icon: 'fas fa-check-circle'
    },
    [EstadoRecurso.ASIGNADO]: {
        label: 'Asignado',
        color: 'primary',
        icon: 'fas fa-user-check'
    },
    [EstadoRecurso.OBSOLETO]: {
        label: 'Obsoleto',
        color: 'danger',
        icon: 'fas fa-box'
    },
    [EstadoRecurso.EXTRAVIADO]: {
        label: 'Extraviado',
        color: 'warning',
        icon: 'fas fa-triangle-exclamation'
    }
};