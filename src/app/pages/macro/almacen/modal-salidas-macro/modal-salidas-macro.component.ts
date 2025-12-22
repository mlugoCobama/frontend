import { Component, EventEmitter, AfterViewInit,ViewChild, } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormTableSalidasComponent } from '../../forms/form-table-salidas/form-table-salidas.component';
import { FormSalidasAlmacenComponent } from '../../forms/form-salidas-almacen/form-salidas-almacen.component';

import { AlmacenService } from 'src/app/core/services/macrotaller/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-modal-salidas-macro',
  templateUrl: './modal-salidas-macro.component.html',
  styleUrl: './modal-salidas-macro.component.css'
})
export class ModalSalidasMacroComponent {
    @ViewChild("formTableSalidas", { static: false })
    formTableSalidas!: FormTableSalidasComponent;
    @ViewChild("formSalidas", { static: false })
    formSalidas!: FormSalidasAlmacenComponent;
  
    public event: EventEmitter<any> = new EventEmitter();
  
    public detalles: any = [];

    public submitted: boolean = false;
    public submittDetail: boolean = false;
  
    ngAfterViewInit(): void {}

    constructor(
      public modalRef: BsModalRef,
      private alerta:  SwalComprsServiceService,
      private almacen:  AlmacenService,
    ){}

    public getDatos(datos) {
    this.detalles = datos;
    this.formTableSalidas.createFormArray(datos);
  }

        /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

    public generarSalidas() {
    const hasDatos = this.formTableSalidas.validarSeleccion();
    const formSalidaValido =  this.formSalidas.esValido();
    
    if(!formSalidaValido){
      this.submitted= true;
      this.alerta.mostrarAlerta(
        "Error",
        "Formulario no valido",
        "warning",
        "warning"
      );
      return;
    }

    if (!hasDatos) {
      this.alerta.mostrarAlerta(
        "Error",
        "Debes de seleccionar por lo menos un detalle",
        "warning",
        "warning"
      );
      return;
    }

    if (!this.formTableSalidas.confirmadosValidos()) {
      this.submittDetail = true;
      this.alerta.mostrarAlerta(
        "Error",
        "Debes de llenar correctamente el detalle",
        "warning",
        "warning"
      );
      return;
    }

    const datos = this.datos();

    // console.log(datos)

    this.almacen.saveSalida(datos).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          // this.modalCerrado.emit();
          this.alerta.mostrarAlerta(
            "Guardado",
            response.message,
            "success",
            "success"
          );

          this.cerrarModal();
          // this.event.emit(false);
        } else {
          console.log(response.message, "error", response.error);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    
  }

  private datos(){
    const datos = this.formTableSalidas.getEntradas();
    const datos2 = this.formSalidas.obtenerValores();

    return {
      salida: datos2,
      detalles : datos
    }
  }

}
