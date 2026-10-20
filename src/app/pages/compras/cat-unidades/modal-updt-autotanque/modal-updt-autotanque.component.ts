import { Component, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import { FormDatosTanqueComponent } from '../form-datos-tanque/form-datos-tanque.component';
import { FormDatosVehiculoComponent } from '../form-datos-vehiculo/form-datos-vehiculo.component';
import { FormDatosPolizaComponent } from '../form-datos-poliza/form-datos-poliza.component';

import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';


@Component({
  selector: 'app-modal-updt-autotanque',
  templateUrl: './modal-updt-autotanque.component.html',
  styleUrl: './modal-updt-autotanque.component.css'
})
export class ModalUpdtAutotanqueComponent implements AfterViewInit {

  public openFormTanque: boolean = false;
  public mostrarFormulario: boolean = false;
  public tipo:any = '';

  @ViewChild('formUdtDatosTanque', { static: false }) formDatosTanque!:  FormDatosTanqueComponent;
  @ViewChild('formUdtDatosVehiculo', { static: false }) formDatosVehiculo!:  FormDatosVehiculoComponent;
  @ViewChild('formUdtDatosPoliza', { static: false }) formDatosPoliza!:  FormDatosPolizaComponent;

  constructor(
    public bsModalRef: BsModalRef,
    private alertasService : SwalComprsServiceService,
    private unidadesService : UnidadesService
  ){}

  ngAfterViewInit(): void {
    this.formDatosTanque.llenarForm();
    this.formDatosVehiculo.llenarForm();
    this.formDatosPoliza.llenarForm();
    this.mostrarFormTanque();
    this.hasDatosSeguro();
  }

    public intercompania:any = 0;
    public datos: any = [];
    public empresas: any = [];
    public deshabilitado: boolean = false;
    public event: EventEmitter<any> = new EventEmitter();
    public modalCerrado: EventEmitter<any> = new EventEmitter();

    public cerrarModal(): void {
      this.deshabilitado = false;
    this.bsModalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  public guardarCambios(){
    this.deshabilitado = true;
    if( !this.formDatosVehiculo.esValido()
      || (this.openFormTanque  &&  !this.formDatosTanque.esValido())
      || (this.mostrarFormulario &&  !this.formDatosPoliza.esValido())){
      this.alertasService.mostrarAlerta("Llena le formualrio correctamente", `Falta información importante, ingresala para continuar: ${this.formDatosVehiculo.mostrarErroresFormulario() 
        || this.formDatosTanque.mostrarErroresFormulario() 
        || this.formDatosPoliza.mostrarErroresFormulario() 
        || 'Campos marcados en rojo'}`, "warning", "warning");
      // this.event.emit(false);
      this.deshabilitado = false;
      return
    }

    const data = this.getDatos();

    this.unidadesService.update(+this.intercompania ,data).subscribe(
              (response) => {
                if (response.status === "success") {
                  
                  this.alertasService.mostrarAlerta("Actualizado", "Unidad actualizada correctamente", "success", "success");
                  this.event.emit(true);
                  this.cerrarModal();
                  this.formDatosTanque.resetearFormulario();
                  this.formDatosVehiculo.resetearFormulario();

                  
                } else {
                  this.alertasService.mostrarAlerta("Error", response.message, "error", "danger");
                  this.deshabilitado = false;
                }
              },
              (error) => {
                this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error", "danger");
                this.deshabilitado = false;
              }
            );
  }

  public getDatos(){
    const datos = {
      datosVehiculo: this.formDatosVehiculo.obtenerValores(),
      datosTanque: this.formDatosTanque.obtenerValores(),
      hasDatosSeguro : this.mostrarFormulario,
      datosPoliza: this.formDatosPoliza.obtenerValores(),
    }

    return datos;
  }

  public mostrarFormTanque(){

   const tipoCombustible =  this.formDatosVehiculo.datosVehiculoFormControl.tipo_combustible.value
   const tipoVehiculo = this.formDatosVehiculo.datosVehiculoFormControl.tipo_vehiculo.value

   if(tipoVehiculo == '3' || tipoVehiculo == '1' 
    || tipoCombustible == '3' || tipoCombustible == '4'){
      this.openFormTanque = true;
      this.formDatosTanque.actualizarValidadoresTanque();
    }else{
      this.openFormTanque = false;
      this.formDatosTanque.actualizarValidadoresTanque();
    }
  }

  public hasDatosSeguro(){
    if(this.datos?.idSeguro !=  null){
      this.mostrarFormulario = true;
      this.formDatosPoliza.actualizarValidadoresPoliza();
    }
  }

  public onCheckboxChange(){
    this.formDatosPoliza.actualizarValidadoresPoliza();
  }
}
