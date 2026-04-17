import { permisosVendedoresAgencias } from "./permisos";
const permisos =  permisosVendedoresAgencias;
export const catalogoAgencias =  [
    { value: "todos", name: "Todas", permiso: "view select agencias all"   },
    { value: "710", name: "Nissan Universidad", permiso: permisos.optionNU },
    { value: "0", name: "Nissan Insurgentes", permiso: permisos.optionNI   },
    { value: "730", name: "Nissan Azcapotzalco", permiso: permisos.optionNA},
    { value: "714", name: "Nissan Campestre", permiso: permisos.optionNC   },
    { value: "1", name: "Renault Azcapotzalco", permiso: permisos.optionRA },
    { value: "2", name: "Renault Ecatepec", permiso: permisos.optionRE     },
    { value: "3", name: "Renault Vallejo", permiso: permisos.optionRV      },
    { value: "4", name: "Renault Pachuca", permiso: permisos.optionRP      },
];