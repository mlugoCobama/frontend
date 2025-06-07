import { Component, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-tabla-pv-area',
  templateUrl: './tabla-pv-area.component.html',
  styleUrl: './tabla-pv-area.component.css'
})
export class TablaPvAreaComponent implements AfterViewInit{
@Input() id:any;
@Input() mes:any;
@Input() mesAnt:any;
@Input() anioAnt:any;
@Input() concepto:any;
@Input() concepto2:any;

@Output() actualizarConcepto = new EventEmitter<string>();

public totalMes:any;
public totalMesAnt:any;
public totalAnioAnt:any;

 public dataMes:any;
 public dataMesAnt:any;
 public dataAnioAnt:any;

constructor(
){}
public areas:any;

ngAfterViewInit(): void {
  this.asignarAreas();
  this.getData();
}

 private asignarAreas(){
  const asComercial = ['area_nuevos', 'area_flotillas', 'area_seminuevos'];
  const asPostVenta= ['area_servicio', 'area_refacciones', 'area_hyp'];
  this.areas = this.concepto === 'area_comercial' ? asComercial : asPostVenta;
 }

 /**
  * Recupera los registros del pv,
  * suma los valores de cada area 
  * total de la suma del area a + area b + area c
  */
 private getData(){
  this.dataMes = this.mes.filter((fila) => fila.id == this.id);
  this.dataMesAnt = this.mesAnt.filter((fila) => fila.id == this.id);
  this.dataAnioAnt = this.anioAnt.filter((fila) => fila.id == this.id);

  const datosMes = [ Number(this.dataMes[0][this.areas[0] ?? 0]), Number(this.dataMes[0][this.areas[1] ?? 0]), Number(this.dataMes[0][this.areas[2] ?? 0]) ];
  const datosMesAnt = [ Number(this.dataMesAnt[0][this.areas[0] ?? 0]), Number(this.dataMesAnt[0][this.areas[1] ?? 0]), Number(this.dataMesAnt[0][this.areas[2] ?? 0]) ];
  const datosAnioAnt = [ Number(this.dataAnioAnt[0][this.areas[0] ?? 0]), Number(this.dataAnioAnt[0][this.areas[1] ?? 0]), Number(this.dataAnioAnt[0][this.areas[2] ?? 0]) ];

  this.totalMes = datosMes.reduce(function (a,b) {return a + b;});
  this.totalMesAnt = datosMesAnt.reduce(function (a,b) {return a + b;});
  this.totalAnioAnt = datosAnioAnt.reduce(function (a,b) {return a + b;});
 }

 public formatearTexto(texto){
  const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
  let textoFormateado = capitalCaseText.replace("_", " ")
  return textoFormateado;
  }

  /**
   * Maneja el evento del click en la tabla
   * @param concepto concepto que recupera de la fila 
   */
  public seleccionar(concepto) {
    this.actualizarConcepto.emit(concepto);
  }
}
