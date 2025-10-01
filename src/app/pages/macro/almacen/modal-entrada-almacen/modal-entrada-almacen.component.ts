import { Component, EventEmitter, AfterViewInit,ViewChild, } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormTableEntradasComponent } from '../../forms/form-table-entradas/form-table-entradas.component';

import { AlmacenService } from 'src/app/core/services/macrotaller/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';


@Component({
  selector: "app-modal-entrada-almacen",
  templateUrl: "./modal-entrada-almacen.component.html",
  styleUrl: "./modal-entrada-almacen.component.css",
})
export class ModalEntradaAlmacenComponent implements AfterViewInit {
  @ViewChild("formTableEntradas", { static: false })
  formTableEntradas!: FormTableEntradasComponent;

  public event: EventEmitter<any> = new EventEmitter();

  public detalles: any = [];
  public isLoad: boolean;

  public submitted: boolean = false;
  public submittDetail: boolean = false;

  ngAfterViewInit(): void {}

  constructor(
    public modalRef: BsModalRef,
    private alerta: SwalComprsServiceService,
    private almacen: AlmacenService
  ) {}

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  public getDatos(datos) {
    this.detalles = datos;
    this.formTableEntradas.createFormArray(datos);
  }

  public generarEntrada() {
    const hasDatos = this.formTableEntradas.validarSeleccion();

    if (!hasDatos) {
      this.alerta.mostrarAlerta(
        "Error",
        "Debes de seleccionar por lo menos un detalle",
        "warning",
        "warning"
      );
      return;
    }

    if (!this.formTableEntradas.confirmadosValidos()) {
      this.alerta.mostrarAlerta(
        "Error",
        "Debes de llenar correctamente el detalle",
        "warning",
        "warning"
      );
      return;
    }

    const datos = this.formTableEntradas.getEntradas();
    this.almacen.save(datos).subscribe(
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
          // this.event.emit(false);
          this.cerrarModal();
        } else {
          console.log(response.message, "error", response.error);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );


  }
}
