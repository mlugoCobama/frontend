import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-relacion-negocio',
  templateUrl: './relacion-negocio.component.html',
  styleUrl: './relacion-negocio.component.css'
})
export class RelacionNegocioComponent implements OnInit {
  relacionForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.relacionForm = this.fb.group({
      // Valor por defecto cargado al iniciar el formulario
      opcionRelacion: ['no_reconoce']
    });

    // Escuchar cambios en el selector (opcional)
    this.relacionForm.get('opcionRelacion')?.valueChanges.subscribe(value => {
      console.log('Opción seleccionada:', value);
    });
  }
}
