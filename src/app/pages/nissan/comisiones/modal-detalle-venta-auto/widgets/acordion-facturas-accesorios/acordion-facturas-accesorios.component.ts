import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-acordion-facturas-accesorios',
  templateUrl: './acordion-facturas-accesorios.component.html',
  styleUrl: './acordion-facturas-accesorios.component.css'
})
export class AcordionFacturasAccesoriosComponent implements OnInit{

  public totalGeneralFacturas: number = 0;

  @Input() venta:any

  @Output() deleteAccesorio : EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    this.calcularTotalGeneral();
  }

  public eliminarAccesorio(indice: number){
    this.deleteAccesorio.emit(indice);
    this.calcularTotalGeneral();
  }



    calcularTotalGeneral() {
      if (!this.venta?.accesorios) {
        this.totalGeneralFacturas = 0;
        return;
      }

      this.totalGeneralFacturas = this.venta.accesorios.reduce((acc, factura) => {
        const totalFactura = factura.totalFactura ?? (+factura.sub_total_factura + +factura.iva);
        return acc + (+totalFactura || 0);
      }, 0);
    }

}
