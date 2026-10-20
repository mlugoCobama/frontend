import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Valida si un campo es requerido si otro campo tiene cierto valor.
 */
export function requiredIf(field: string, value: any): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.parent) return null;

    const relatedField = control.parent.get(field);
    if (!relatedField) return null;

    if (relatedField.value === value && !control.value) {
      return { requiredIf: true };
    }

    return null;
  };
}

/**
 * Valida múltiples correos separados por coma.
 */
export function multipleEmailsValidator(): ValidatorFn {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (control: AbstractControl) => {
    if (!control.value) return null;

    const emails = control.value.split(',').map((e: string) => e.trim());
    const invalidEmails = emails.filter((e: string) => !emailRegex.test(e));

    if (invalidEmails.length > 0) {
      return { invalidEmails: invalidEmails.join(', ') };
    }

    return null;
  };
}
