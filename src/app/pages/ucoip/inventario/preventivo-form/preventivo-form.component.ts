import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-preventivo-form',
  templateUrl: './preventivo-form.component.html'
})
export class PreventivoFormComponent {

  /** FormGroup 'preventivo' del form padre. Se pasa por referencia, no se clona. */
  @Input({ required: true }) group!: FormGroup;

  checklist = [
    { control: 'limpieza_externa', label: 'Limpieza externa' },
    { control: 'limpieza_interna', label: 'Limpieza interna' },
    { control: 'limpieza_ventiladores', label: 'Limpieza ventiladores' },
    { control: 'limpieza_disipadores', label: 'Limpieza disipadores' },
    { control: 'limpieza_fuente', label: 'Limpieza fuente de poder' },
    { control: 'pasta_termica', label: 'Cambio pasta térmica' },
    { control: 'revision_ram', label: 'Revisión RAM' },
    { control: 'revision_disco', label: 'Revisión HDD / SSD' },
    { control: 'revision_conexiones', label: 'Revisión conexiones' },
    { control: 'revision_cables', label: 'Revisión cables' },
    { control: 'revision_usb', label: 'Revisión USB' },
    { control: 'revision_red', label: 'Revisión Red' },
    { control: 'revision_teclado', label: 'Revisión teclado' },
    { control: 'revision_mouse', label: 'Revisión mouse' },
    { control: 'revision_monitor', label: 'Revisión monitor' },
    { control: 'actualizacion_so', label: 'Actualización SO' },
    { control: 'actualizacion_drivers', label: 'Actualización Drivers' },
    { control: 'actualizacion_antivirus', label: 'Actualización Antivirus' },
    { control: 'limpieza_temporales', label: 'Eliminar temporales' },
    { control: 'optimizacion', label: 'Optimización' }
  ];
}