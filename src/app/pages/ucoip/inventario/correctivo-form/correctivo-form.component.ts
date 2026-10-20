import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-correctivo-form',
  templateUrl: './correctivo-form.component.html'
})
export class CorrectivoFormComponent {
  @Input({ required: true }) group!: FormGroup;
  @Input({ required: true }) checklistGroup!: FormGroup;

  @Input() items: any[] = [];

  @Input() loading = false;

  constructor(private fb: FormBuilder) {}

  get piezas(): FormArray {
    return this.group.get('piezas') as FormArray;
  }

  agregarPieza(): void {
    this.piezas.push(
      this.fb.group({
        descripcion: [''],
        origen: [''],
        no_serie_anterior: [''],
        no_serie_nueva: [''],
        cantidad: [''],
        costo_unitario: [''],
        costo_total: [''],
        observacion: ['']
      })
    );
  }

  eliminarPieza(index: number): void {
    this.piezas.removeAt(index);
  }
}
