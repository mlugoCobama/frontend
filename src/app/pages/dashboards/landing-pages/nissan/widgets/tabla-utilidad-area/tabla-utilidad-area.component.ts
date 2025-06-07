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

 public mes:any;
 public mesAnt:any;
 public anioAnt:any;

 public totalMes:any;
 public totalMesAnt:any;
 public totalAnioAnt:any;

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

/**
 * Asigna las areas a calcular basándose en el concepto dado
 */
 private asignarAreas(){
  const asComercial = ['area_nuevos', 'area_flotillas', 'area_seminuevos'];
  const asPostVenta= ['area_servicio', 'area_refacciones', 'area_hyp'];
  this.areas = this.concepto === 'area_comercial' ? asComercial : asPostVenta;
 }


/**
 * Recupera los totales y calcula el total acumulado de las areas por mes
 */
 recuperaTotales(){
  //Datos de donde se recuperan los totales de cada area
  this.mes = this.dataEnergeticos.mes.filter((agencia) => agencia.estacion === 'Total');
  this.mesAnt = this.dataEnergeticos.mesAnt.filter((agencia) => agencia.estacion === 'Total');
  this.anioAnt = this.dataEnergeticos.anioAnt.filter((agencia) => agencia.estacion === 'Total');

  // Calculo del acumulado total de ares por mes
  this.totalMes = [Number(this.mes[0][this.areas[0]] ?? 0) ,Number(this.mes[0][this.areas[1]] ?? 0),Number(this.mes[0][this.areas[2]]) ?? 0].reduce(function (a,b) {return a + b;});
  this.totalMesAnt = [Number(this.mesAnt[0][this.areas[0]] ?? 0),Number(this.mesAnt[0][this.areas[1]] ?? 0),Number(this.mesAnt[0][this.areas[2]] ?? 0)].reduce(function (a,b) {return a + b;});
  this.totalAnioAnt = [Number(this.anioAnt[0][this.areas[0]]?? 0),Number(this.anioAnt[0][this.areas[1]]?? 0),Number(this.anioAnt[0][this.areas[2]]) ?? 0].reduce(function (a,b) {return a + b;});
 }

 /**
  * Despliega el modal con los datos de las agencias
  * @param concepto nombre del area al que se le dio click
  */
 public openModalDetalleArea(concepto) {
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
