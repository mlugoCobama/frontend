import { Component, Input, Output, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-tabla-mes-agencia',
  templateUrl: './tabla-mes-agencia.component.html',
  styleUrls: ['./tabla-mes-agencia.component.css']
})
export class TablaMesAgenciaComponent implements OnInit {

  @Input() dataMesAgencias: any;

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }

  public filasUV = [
   "nuevos",
   "utilidad_nuevos",
   "flotillas",
   "utilidad_flotillas",
   "seminuevos",
   "utilidad_seminuevos"
  ]

  public filasOS = [
    "servicio",
    "utilidad_servicio",
    "hyp",
    "utilidad_hyp",
   ]

   public filasVPS = [
    
   ]

   public filasCFC = [
    
   ]


  // public filas:any = Object.keys(this.dataMesAgencias[0]);



  ngOnInit() {
    // console.log(this.dataMesAgencias);
  }

  objeckKeys(obj:any):string[]{
    return  Object.keys(obj);
  }
}
