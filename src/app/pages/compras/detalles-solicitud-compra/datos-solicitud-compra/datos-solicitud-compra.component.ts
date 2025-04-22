import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-datos-solicitud-compra',
  templateUrl: './datos-solicitud-compra.component.html',
  styleUrls: ['./datos-solicitud-compra.component.css']
})
export class DatosSolicitudCompraComponent  {
 @Input() solicitudCompra: any;
 @Input() cotizacion: any;
 @Input() mostrarTotal: any;
}
