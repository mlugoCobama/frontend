import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-domicilio-contacto-form',
  templateUrl: './domicilio-contacto-form.component.html',
  styleUrl: './domicilio-contacto-form.component.css'
})
export class DomicilioContactoFormComponent implements OnInit {
  registroForm!: FormGroup;
  @Input() data: any = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      // Datos Fiscales / Identificación
      rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4})?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d]{2}[A\d])?$/i)]],
      curp: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/i)]],

      // Domicilio
      calleVia: ['', Validators.required],
      noExterior: ['', Validators.required],
      noInterior: [''],
      colonia: ['', Validators.required],
      // alcaldiaUrbanizacion: ['', Validators.required],
      municipioDemarcacion: ['', Validators.required],
      ciudadPoblacion: ['', Validators.required],
      pais: ['México', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],

      // Contacto
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

   public sethValues(datos:any){
      console.log(datos)
      const rfc =  datos?.csf?.identificacion_fiscal?.rfc ?? '';
      const curp = datos?.curp?.curp ?? '';
      const calle = datos?.comprobante_domicilio?.domicilio?.calle;
      const num_exterior = datos?.comprobante_domicilio?.domicilio?.numero_exterior ?? 'Sin Numero';

      const num_interior = datos?.comprobante_domicilio?.domicilio?.numero_interior ?? '';
      const colonia = datos?.comprobante_domicilio?.domicilio?.colonia ?? '';
      const municipio = datos?.comprobante_domicilio?.domicilio?.municipio ?? '';
      const ciudad = datos?.comprobante_domicilio?.domicilio?.estado ?? '';
      const codigoPostal = datos?.comprobante_domicilio?.domicilio?.codigo_postal ?? '';
      const pais = datos?.comprobante_domicilio?.domicilio?.pais ?? '';


      this.registroForm.patchValue({
      rfc: rfc,
      curp: curp,
      calleVia: calle,
      noExterior: num_exterior,
      noInterior: num_interior,
      colonia: colonia ,
      // alcaldiaUrbanizacion: ['', Validators.required],
      municipioDemarcacion: municipio,
      ciudadPoblacion: ciudad,
      pais: pais,
      codigoPostal:codigoPostal
      });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Datos del Formulario:', this.registroForm.value);
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}
