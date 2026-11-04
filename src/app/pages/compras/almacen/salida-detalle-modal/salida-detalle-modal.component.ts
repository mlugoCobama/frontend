import { Component, EventEmitter, inject, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

export interface DetalleSalida {
  id_detalle: number;
  cant: string | number;
  unidadMedida: string;
  descripcion: string;
  observaciones: string;
  tipo: string;
}

export interface SalidaKardex {
  id: number;
  folio: string;
  fecha: string;
  usuario_entrega: string;
  usuario_recibe: string;
  detalles: DetalleSalida[];
}

@Component({
  selector: 'app-salida-detalle-modal',
  templateUrl: './salida-detalle-modal.component.html',
  styleUrl: './salida-detalle-modal.component.css'
})
export class SalidaDetalleModalComponent {

  public event: EventEmitter<any> = new EventEmitter();
  @Input() data: SalidaKardex | null = null;

  public modalRef = inject(BsModalRef);


   /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }
}
