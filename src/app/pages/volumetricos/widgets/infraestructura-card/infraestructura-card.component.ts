import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-infraestructura-card',
  templateUrl: './infraestructura-card.component.html',
  styleUrl: './infraestructura-card.component.css'
})
export class InfraestructuraCardComponent {
  @Input() nroTanques: number = 0;
  @Input() nroDispensarios: number = 0;
  @Input() nroPozos: number = 0;
  @Input() ductosEdaSda: number = 0;
  @Input() ductosTptDsn: number = 0;
  @Input() claveProducto: string = 'Desconocido';
}
