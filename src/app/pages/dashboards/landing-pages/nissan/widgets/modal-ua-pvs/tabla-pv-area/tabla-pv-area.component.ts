import { Component, AfterViewInit, Input, Output, EventEmitter  } from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { ResponseAgenciasNissan } from 'src/app/core/models/dashboard/agencias-nissan';
import { AgenciasService } from 'src/app/core/services/dashboard/agencias.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
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

constructor(
  private localStorage:LocalStorageServiceService,
  private agencias:AgenciasService,
  private gaseras:EnergeticosGaserasService
){}
public areas:any;

ngAfterViewInit(): void {
  this.asignarAreas();
  this.getData();
}

 private asignarAreas(){
  if(this.concepto === 'area_comercial'){
    this.areas = ['area_nuevos', 'area_flotillas', 'area_seminuevos'];
  }
  else{
    this.areas = ['area_servicio', 'area_refacciones', 'area_hyp'];
  }
 }


 public dataMes:any;
 public dataMesAnt:any;
 public dataAnioAnt:any;

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

  public dataEnergeticos:any;
  public copiaData:any;

    public seleccionar(concepto) {
      this.actualizarConcepto.emit(concepto);
    }
}
