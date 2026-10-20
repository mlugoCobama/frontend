import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-identificacion-form',
  templateUrl: './datos-identificacion-form.component.html',
  styleUrl: './datos-identificacion-form.component.css'
})
export class DatosIdentificacionFormComponent implements OnInit {
  clienteForm!: FormGroup;

  @Input() data: any = false;

  // Expressión regular para RFC (Persona Física / Moral)
  readonly rfcPattern = '^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$';

  // Expresión regular para CURP
  readonly curpPattern = '^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z][0-9]$';

  // Catálogos
  paises: string[] = ['México', 'Estados Unidos', 'España', 'Colombia', 'Argentina', 'Canadá', 'Otro'];

  regimenesFiscales: string[] = [
    '601 - General de Ley Personas Morales',
    '605 - Sueldos y Salarios e Ingresos por Asimilados a Salarios',
    '606 - Arrendamiento',
    '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    '621 - Incorporación Fiscal',
    '626 - Régimen Simplificado de Confianza (RESICO)'
  ];

  opcionesPep = [
    { value: 'NO', label: 'No soy ni estoy relacionado con una PEP' },
    { value: 'RELACIONADA', label: 'Soy familiar, socio o allegado de una PEP' },
    { value: 'SI', label: 'Soy PEP / servidor público con poder de decisión' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if(this.data){
      // this.sethValues(this.data.data);
    }
    console.log(this.data)
  }

  private initForm(): void {
    this.clienteForm = this.fb.group({
      rfc: ['', [Validators.required, Validators.pattern(this.rfcPattern)]],
      curp: ['', [Validators.required, Validators.pattern(this.curpPattern)]],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', [Validators.required]],
      paisNacimiento: ['México', [Validators.required]],
      paisNacionalidad: ['México', [Validators.required]],
      actividadGiroOcupacion: ['', [Validators.required]],
      actividadGiroRegimen: ['', [Validators.required]],
      esPep: ['NO', [Validators.required]], // Tres opciones: NO, SI_NACIONAL, SI_EXTRANJERO
      especifiquePep: [''] // Campo condicional si la respuesta es Sí
    });

    // Escuchar cambios en esPep para requerir especificación en caso de ser afirmativo
    this.clienteForm.get('esPep')?.valueChanges.subscribe(val => {
      const especifiqueCtrl = this.clienteForm.get('especifiquePep');
      if (val !== 'NO') {
        especifiqueCtrl?.setValidators([Validators.required]);
      } else {
        especifiqueCtrl?.clearValidators();
        especifiqueCtrl?.setValue('');
      }
      especifiqueCtrl?.updateValueAndValidity();
    });
  }

  public sethValues(datos:any){
      const nombre_completo  =  `${datos?.ine?.nombre ?? ''} ${datos?.ine?.apellido_paterno ?? ''} ${datos?.ine?.apellido_materno ?? ''}`
      const fecha_nacimiento = datos?.ine?.fecha_nacimiento ?? null
      const rfc =  datos?.csf?.identificacion_fiscal?.rfc ?? ''
      const curp = datos?.curp?.curp ?? ''
      const regimen =  datos?.csf?.regimenes_fiscales[0]?.regimen ?? ''
      this.clienteForm.patchValue({
      rfc: rfc,
      curp: curp,
      nombreCompleto: nombre_completo,
      fechaNacimiento: fecha_nacimiento,
      actividadGiroOcupacion: regimen
      });
  }

  guardar(): void {
    if (this.clienteForm.valid) {
      console.log('Datos de identificación del cliente:', this.clienteForm.value);
    } else {
      this.clienteForm.markAllAsTouched();
    }
  }
}
