import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css'
})
export class KpiCardComponent {
  @Input() icono: string = 'fas fa-chart-bar'; // valor por defecto
  @Input() color: string = 'text-secondary';   // valor por defecto
  @Input() titulo: string = '';
  @Input() prefijo: string = ''; 
  @Input() sufijo: string = '';                // opcional para el texto
  @Input() note: string = '';
  @Input() valor: any = 0;
}
