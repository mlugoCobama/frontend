import { AfterViewInit, Component,  EventEmitter,  ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormAsignarModulosComponent } from '../../forms/form-asignar-modulos/form-asignar-modulos.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { PuestosService } from 'src/app/core/services/capacitaciones/puestos.service';

@Component({
  selector: 'app-modal-puesto',
  templateUrl: './modal-puesto.component.html',
  styleUrl: './modal-puesto.component.css'
})
export class ModalPuestoComponent implements AfterViewInit  {

  public sending: boolean = false;

  public data: any;
  @ViewChild('formAsignarModulos', { static: false }) formAsignarModulos!:  FormAsignarModulosComponent;

  constructor(
    public modalRef: BsModalRef,
    public alerta: SwalComprsServiceService,
    public puestos : PuestosService
  ){}

  ngAfterViewInit() {

  }

  public event: EventEmitter<any> = new EventEmitter();
  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  public save(){
    this.sending = true
    if(!this.formAsignarModulos.formValido()){
      this.alerta.mostrarAlerta("Error", " Llena correctamente el formulario e intenta nuevamente", "warning", "warning");
      this.sending = false;
      return;
    }

    const data = this.formAsignarModulos.guardar();

    this.puestos.save(data).subscribe(
              (response) => {
                if (response.status === "success") {
                  this.event.emit(true);
                  this.alerta.mostrarAlerta("Guardado", response.message , "success", "success");
                  // this.event.emit(false);
                  this.cerrarModal();
                  this.sending = false;
                } else {
                  this.alerta.mostrarAlerta("Error", response.message , "error", "error");
                  this.sending = false;
                }
              },
              (error) => {
                 this.alerta.mostrarAlerta("Error", `"Error fetching data:" ${error}` , "error", "error");
                 this.sending = false;
              }
            );
  }

}
