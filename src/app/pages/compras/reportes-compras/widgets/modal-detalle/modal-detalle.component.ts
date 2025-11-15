import { Component, EventEmitter, OnInit} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrl: './modal-detalle.component.css'
})
export class ModalDetalleComponent implements OnInit {

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  public data: any;
  public solicitudCompra: any = {}; // Inicializamos como objeto vacío

  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {
    if (this.data) {
      this.solicitudCompra = {
        id: this.data.idSolicitudCompra,
        folio: this.data.folio_solicitud,
        estatus: this.data.estatus,
        fecha: this.data.fecha,
        proveedor: this.data.proveedor,
        at: this.data.at,
        servicio: this.data.servicio,
        total_at: this.data.total_at
      };
    }
  }

  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => {
      this.modalCerrado.emit();
    }, 150);
  }
}

