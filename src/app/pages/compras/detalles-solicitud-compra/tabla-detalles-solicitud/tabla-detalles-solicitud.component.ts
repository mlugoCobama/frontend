import { Component, Input, Output, EventEmitter, OnInit, OnChanges,SimpleChanges } from '@angular/core';

import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";

import Swal from "sweetalert2";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-tabla-detalles-solicitud',
  templateUrl: './tabla-detalles-solicitud.component.html',
  styleUrls: ['./tabla-detalles-solicitud.component.css']
})
export class TablaDetallesSolicitudComponent implements OnInit{
 @Input() solicitudCompra: any;
 @Input() detalles:any[] = [];
 @Input() cotProv:any[] = [];
 @Input() totals:any = {};
 @Input() totalMasBajo: number| null = null;
 @Input() mostrarTotal : boolean = false;
 @Input() isLoad : boolean = false;
 

 @Output() updatePrices = new EventEmitter <void>();
 @Output() validateInput = new EventEmitter <Event>();
 @Output() openModal = new EventEmitter <string>();

 public cotizacion: any;
 
constructor(
    public comprasService: ComprasService,
    private cotizacionesService: CotizacionesService,
  ) {}

  public ngOnInit(): void {
    
  }

  actualizarPrecios(){
    this.updatePrices.emit();
   }
  
   validacionInput(event: Event){
    this.validateInput.emit(event);
   }
  
   verReferencia(image: string){
    this.openModal.emit(image);
   }

 public updateTotals() {
  this.totals = {};
  this.cotProv.forEach((cotizacion) => {
    let total = 0;
    const proveedorId = cotizacion.proveedores_id[0].id;
    this.detalles.forEach((detalle) => {
      const precio = parseFloat(detalle["precio_" + proveedorId]);
      if (!isNaN(precio)) {
        total += precio * detalle.cantidad;
      }
    });

    this.totals["precio_" + proveedorId] = total;
  });
  this.totalMasBajo = this.getTotalMasBajo();
}

getTotalMasBajo(): number {
  let tmasBajo = Number.MAX_VALUE;
  for (let prov of this.cotProv) {
    let total = this.totals["precio_" + prov.proveedores_id[0].id];
    if (total < tmasBajo) {
      tmasBajo = total;
    }
  }
  if (tmasBajo != 0) {
    return tmasBajo;
  }
}

validateNumberInput(event: any) {
  const inputValue = event.target.value;
  const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

  if (!validNumber) {
    event.target.value = inputValue.slice(0, -1);
  }
}



}