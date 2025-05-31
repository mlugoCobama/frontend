import { Component, Input, AfterViewInit } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';

@Component({
  selector: 'app-tabla-utilidad-area',
  templateUrl: './tabla-utilidad-area.component.html',
  styleUrl: './tabla-utilidad-area.component.css'
})
export class TablaUtilidadAreaComponent implements AfterViewInit{
 @Input() concepto:any;

 public areas:any = [];
 public modalRef?: BsModalRef;

 private actualizarDatosSubscripcion: Subscription;
 

 public dataEnergeticos: any;

 constructor(
    private localStorage: LocalStorageServiceService,
    private modalService: BsModalService,
    private gaseras: EnergeticosGaserasService,
  ){}

 ngAfterViewInit(): void {
   this.construirTablas();
   this.actualizarDatosSubscripcion =
    this.gaseras.actualizarData$.subscribe(() => {
      this.construirTablas();
    });
 }


 private construirTablas(){
  this.asignarAreas();
   this.recuperarData();
   this.recuperaTotales();
 }

 private recuperarData(){
  this.dataEnergeticos = [];
  this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
  // this.deleteLast();
 }

 private asignarAreas(){
  if(this.concepto === 'area_comercial'){
    this.areas = ['area_nuevos', 'area_flotillas', 'area_seminuevos'];
  }
  else{
    this.areas = ['area_servicio', 'area_refacciones', 'area_hyp'];
  }
 }

 public mes:any;
 public mesAnt:any;
 public anioAnt:any;
 
 public totalMes:any;
 public totalMesAnt:any;
 public totalAnioAnt:any;

 recuperaTotales(){
  
  this.mes = this.dataEnergeticos.mes.filter((agencia) => agencia.estacion === 'Total') 
  this.mesAnt = this.dataEnergeticos.mesAnt.filter((agencia) => agencia.estacion === 'Total') 
  this.anioAnt = this.dataEnergeticos.anioAnt.filter((agencia) => agencia.estacion === 'Total') 

  const arrayMes = [Number(this.mes[0][this.areas[0]] ?? 0) ,Number(this.mes[0][this.areas[1]] ?? 0),Number(this.mes[0][this.areas[2]]) ?? 0].reduce(function (a,b) {return a + b;})
  const arraymesAnt = [Number(this.mesAnt[0][this.areas[0]] ?? 0),Number(this.mesAnt[0][this.areas[1]] ?? 0),Number(this.mesAnt[0][this.areas[2]] ?? 0)].reduce(function (a,b) {return a + b;})
  const arrayanioAnt = [Number(this.anioAnt[0][this.areas[0]]?? 0),Number(this.anioAnt[0][this.areas[1]]?? 0),Number(this.anioAnt[0][this.areas[2]]) ?? 0].reduce(function (a,b) {return a + b;})

  this.totalMes = arrayMes;
  this.totalMesAnt = arraymesAnt;
  this.totalAnioAnt = arrayanioAnt;


 }

 public openModalNuevo(concepto) {
     const initialState: ModalOptions = {
       initialState: {
         concepto: concepto
       },
       class: "modal-lg",
     };
     this.modalRef = this.modalService.show(ModalDetalleComponent, initialState);
     this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
     
    });
   }

  public formatearTexto(texto){
  const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
  let textoFormateado = capitalCaseText.replace("_", " ")
  return textoFormateado;
  }
}
