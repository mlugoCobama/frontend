import { FormGroup } from '@angular/forms';

export function obtenerErroresFormulario(form: FormGroup): string[] {
  const errores: string[] = [];

  Object.keys(form.controls).forEach(campo => {
    const control = form.get(campo);
    const exclusiones = ['id', 'codigo', 'clave', 'cat'];

    if (control && control.invalid) {
      const nombreCampo = campo
            .replace(/_/g, ' ')
            .replace(new RegExp(`\\b(${exclusiones.join('|')})\\b`, 'gi'), '')
            .trim();


      if (control.errors?.['required']) {
        errores.push(`El campo "${nombreCampo}" es obligatorio.`);
      }

      if (control.errors?.['minlength']) {
        errores.push(`"${nombreCampo}" debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`);
      }

      if (control.errors?.['pattern']) {
        errores.push(`"${nombreCampo}" tiene un formato inválido.`);
      }

      if (control.errors?.['min']) {
        errores.push(`"${nombreCampo}" debe ser mayor o igual a ${control.errors['min'].min}.`);
      }

      if (control.errors?.['max']) {
        errores.push(`"${nombreCampo}" debe ser menor o igual a ${control.errors['max'].max}.`);
      }
    }
  });

  return errores;
}


type MensajesError = {
  [key: string]: (campo: string, errorValue?: any) => string;
};

const mensajesError: MensajesError = {
  required: (campo) => `El campo "${campo}" es obligatorio.`,
  minlength: (campo, errorValue) =>
    `"${campo}" debe tener al menos ${errorValue.requiredLength} caracteres.`,
  pattern: (campo) => `"${campo}" tiene un formato inválido.`,
  min: (campo, errorValue) =>
    `"${campo}" debe ser mayor o igual a ${errorValue.min}.`,
  max: (campo, errorValue) =>
    `"${campo}" debe ser menor o igual a ${errorValue.max}.`,

  // validadores personalizados
  placaInvalida: (campo) => `"${campo}" no corresponde a una placa válida.`,
  rangoFechas: (campo, errorValue) =>
    `"${campo}" debe estar entre ${errorValue.min} y ${errorValue.max}.`,
};

export function obtenerPrimerError(form: FormGroup): string | null {
  for (const campo of Object.keys(form.controls)) {
    const control = form.get(campo);
    if (control && control.invalid && control.errors) {
    const exclusiones = ['id', 'codigo', 'clave', 'cat', 'ucoip_'];
    const nombreCampo = campo
            .replace(/_/g, ' ')
            .replace(new RegExp(`\\b(${exclusiones.join('|')})\\b`, 'gi'), '')
            .trim();

      for (const errorKey of Object.keys(control.errors)) {
        const errorValue = control.errors[errorKey];
        const generadorMensaje = mensajesError[errorKey];

        if (generadorMensaje) {
          return generadorMensaje(nombreCampo, errorValue);
        } else {
          // genérico para errores no mapeados
          return `"${nombreCampo}" tiene un error de tipo "${errorKey}".`;
        }
      }
    }
  }
  return null;
}

