import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-preventivo-form',
  templateUrl: './preventivo-form.component.html'
})
export class PreventivoFormComponent {

  /** FormGroup 'checklist' del form padre (contiene controles de AMBOS tipos) */
  @Input({ required: true }) group!: FormGroup;

  /** Subconjunto del catálogo ya filtrado por tipo=1 (preventivo) */
  @Input() items: any[] = [];

  @Input() loading = false;
}
