import { Component, EventEmitter, ViewChild, AfterViewInit  } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import { FormDatosTanqueComponent } from '../form-datos-tanque/form-datos-tanque.component';
import { FormDatosVehiculoComponent } from '../form-datos-vehiculo/form-datos-vehiculo.component';

import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';

@Component({
  selector: 'app-modal-add-autotanque',
  templateUrl: './modal-add-autotanque.component.html',
  styleUrl: './modal-add-autotanque.component.css'
})
export class ModalAddAutotanqueComponent implements AfterViewInit{

  constructor(
    public bsModalRef: BsModalRef,
    private alertasService : SwalComprsServiceService,
    private unidadesService : UnidadesService
  ){}

  
  ngAfterViewInit(): void {
    
  }

   @ViewChild('formDatosTanque') formDatosTanque!:  FormDatosTanqueComponent;
   @ViewChild('formDatosVehiculo') formDatosVehiculo!:  FormDatosVehiculoComponent;
     
    public empresas: any;
    public intercompania: any;
    public deshabilitado: boolean = false;

    public event: EventEmitter<any> = new EventEmitter();

    public cerrarModal(): void {
    this.bsModalRef.hide();
    }

  setTitle(){
    const dato = this.empresas.find(item => +item.intercompania === +this.intercompania);
    return dato.name
  }

  public guardar(){
    this.deshabilitado = true;
    if(!this.formDatosTanque.esValido() || !this.formDatosVehiculo.esValido()){
      this.alertasService.mostrarAlerta("Llena le formualrio correctamente",
                                        "Falta información importante, ingresala para continuar",
                                        "warning", 
                                        "warning");
      this.event.emit(false);
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
      datosTanque: this.formDatosTanque.obtenerValores() 
    }
    
    return datos;
  }
}
