import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-info-venta',
  templateUrl: './card-info-venta.component.html',
  styleUrl: './card-info-venta.component.css'
})
export class CardInfoVentaComponent {
  @Input() data:any;
}
