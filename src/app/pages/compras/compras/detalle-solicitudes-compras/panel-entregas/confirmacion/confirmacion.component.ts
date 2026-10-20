import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent implements OnChanges {

  @Input() entradas:any[]=[];
  @Input() activos:any[]=[];

  resumen:any={};

  ngOnChanges(){

    this.generarResumen();

  }

  generarResumen(){
    this.resumen={

      totalProductos:this.entradas.length,

      totalRecibidos:
      this.entradas.reduce(
        (total,item)=>
        total + (+item.recibidos || 0)
      ,0),

      inventariados:
      this.entradas.filter(
        item=>item.requiereInventario
      ),

      totalInventariados:
      this.entradas.filter(
        item=>item.requiereInventario
      ).length,

      totalActivos: this.activos?.length ?? 0

    };

  }

}
