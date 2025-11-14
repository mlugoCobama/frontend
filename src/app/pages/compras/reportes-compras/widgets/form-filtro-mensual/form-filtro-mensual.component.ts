import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-filtro-mensual',
  templateUrl: './form-filtro-mensual.component.html',
  styleUrl: './form-filtro-mensual.component.css'
})
export class FormFiltroMensualComponent {

  miFormulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.miFormulario = this.fb.group({
      tipo: [''],
      fechaInicial: [''],
      fechaFinal: ['']
    });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }
}
