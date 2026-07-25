import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-correctivo-form',
  templateUrl: './correctivo-form.component.html'
})
export class CorrectivoFormComponent {

  /** FormGroup 'correctivo' del form padre. */
  @Input({ required: true }) group!: FormGroup;

  correctivoChecklist = [
    { control: 'reinstalacion_so', label: 'Reinstalación SO' },
    { control: 'instalacion_drivers', label: 'Instalación drivers' },
    { control: 'configuracion', label: 'Configuración' },
    { control: 'pruebas', label: 'Pruebas' }
  ];

  constructor(private fb: FormBuilder) {}

  get piezas(): FormArray {
    return this.group.get('piezas') as FormArray;
  }

  agregarPieza(): void {
    this.piezas.push(
      this.fb.group({
        pieza: [''],
        anterior: [''],
        nueva: [''],
        serie: [''],
        observacion: ['']
      })
    );
  }

  eliminarPieza(index: number): void {
    this.piezas.removeAt(index);
  }
}
