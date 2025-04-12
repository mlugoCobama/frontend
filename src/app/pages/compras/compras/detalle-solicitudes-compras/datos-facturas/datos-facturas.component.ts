import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-facturas',
  templateUrl: './datos-facturas.component.html',
  styleUrl: './datos-facturas.component.css'
})
export class DatosFacturasComponent {
  @Input() mostrarDtsFac:any; //Bandera para mostrar o no los datos de la factura

  @Input() ordenCompra:any;
  
  @Input() factura:any; // Datos de la factura 
}
