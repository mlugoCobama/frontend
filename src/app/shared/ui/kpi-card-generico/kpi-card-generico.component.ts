import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card-generico',
  templateUrl: './kpi-card-generico.component.html',
  styleUrl: './kpi-card-generico.component.css'
})
export class KpiCardGenericoComponent {
@Input() title: string = '';          // Título del KPI
  @Input() kpi: number | string = '';   // Valor del KPI
  @Input() description?: string;        // Descripción opcional
  @Input() colorClass: string = 'text-primary'; // Clase Bootstrap para color

}
