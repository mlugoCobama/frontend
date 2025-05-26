import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalComprsServiceService {

  constructor() { }
    /**
     * Genera una alerta de swet alert con un solo boton
     * @param titulo titulo de la alerta
     * @param texto mensaje de la alerta
     * @param icono icono de la alerta
     * @param btnClass clase que define el color del botón (en colores de bootstrap)
     */
    mostrarAlerta(titulo: any, texto: any, icono: any, btnClass: any) {
      Swal.fire({
        title: titulo,
        text: texto,
        buttonsStyling: false,
        icon: icono,
        customClass: {
          confirmButton: `btn btn-${btnClass} px-4`,
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
    }
}
