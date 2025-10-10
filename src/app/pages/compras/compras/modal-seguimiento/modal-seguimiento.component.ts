import { Component, Input, OnInit, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-seguimiento',
  templateUrl: './modal-seguimiento.component.html',
  styleUrl: './modal-seguimiento.component.css'
})
export class ModalSeguimientoComponent {

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  public solicitudCompra: any;
    
  constructor(
      public modalRef: BsModalRef
    ) {}

   /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
  }
}
