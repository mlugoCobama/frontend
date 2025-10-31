import { Component, EventEmitter, ViewChild, AfterViewInit  } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import { FormDatosTanqueComponent } from '../form-datos-tanque/form-datos-tanque.component';
import { FormDatosVehiculoComponent } from '../form-datos-vehiculo/form-datos-vehiculo.component';
import { FormDatosPolizaComponent } from '../form-datos-poliza/form-datos-poliza.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';

@Component({
  selector: 'app-modal-add-autotanque',
  templateUrl: './modal-add-autotanque.component.html',
  styleUrl: './modal-add-autotanque.component.css'
})
export class ModalAddAutotanqueComponent implements AfterViewInit{

  public openFormTanque: boolean = false;
  public mostrarFormulario: boolean = false;


  constructor(
    public bsModalRef: BsModalRef,
    private alertasService : SwalComprsServiceService,
    private unidadesService : UnidadesService
  ){}

  
  ngAfterViewInit(): void {
    
  }

   @ViewChild('formDatosTanque', { static: false }) formDatosTanque!:  FormDatosTanqueComponent;
   @ViewChild('formDatosVehiculo', { static: false }) formDatosVehiculo!:  FormDatosVehiculoComponent;
   @ViewChild('formDatosPoliza', { static: false }) formDatosPoliza!:  FormDatosPolizaComponent;
     
    public empresas: any = [];
    public intercompania: any = 0;
    public deshabilitado: boolean = false;

    public event: EventEmitter<any> = new EventEmitter();
    public modalCerrado: EventEmitter<any> = new EventEmitter();

    public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
    }

  setTitle(){
    const dato = this.empresas.find(item => +item.intercompania === +this.intercompania);
    return dato.name
  }

  public guardar(){
    this.deshabilitado = true;
    if(
       !this.formDatosVehiculo.esValido()
      || (this.openFormTanque  &&  !this.formDatosTanque.esValido())
      || (this.mostrarFormulario &&  !this.formDatosPoliza.esValido())
    ){
      this.alertasService.mostrarAlerta("Llena le formualrio correctamente",
                                         `Falta información importante, ingresala para continuar: ${this.formDatosVehiculo.mostrarErroresFormulario() || 'Campos marcados en rojo'}`,
                                        "warning", 
                                        "warning");
      // this.event.emit(false);
      this.deshabilitado = false;
      return
    }

    const data = this.getDatos();
            this.unidadesService.save(data).subscribe(
              (response) => {
                if (response.status === "success") {
                  
                  this.alertasService.mostrarAlerta("Guardado", "Unidad registrada correctamente", "success", "success");
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

  private getDatos(){

    const datos = {
      intercompania: this.intercompania,
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

   if(tipoVehiculo == 'autotanque' || tipoVehiculo == 'reparto' 
    || tipoCombustible == 'gas_natural' || tipoCombustible == 'gas_lp'){
      this.openFormTanque = true;
      this.formDatosTanque.actualizarValidadoresTanque();
    }else{
      this.openFormTanque = false;
      this.formDatosTanque.actualizarValidadoresTanque();
    }
  }

  public onCheckboxChange(){
    this.formDatosPoliza.actualizarValidadoresPoliza();
  }
}
