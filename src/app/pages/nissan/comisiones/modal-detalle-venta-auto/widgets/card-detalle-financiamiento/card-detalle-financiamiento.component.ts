import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-detalle-financiamiento',
  templateUrl: './card-detalle-financiamiento.component.html',
  styleUrl: './card-detalle-financiamiento.component.css'
})
export class CardDetalleFinanciamientoComponent {
  @Input() data:any
  @Input() dataVenta:any

}
