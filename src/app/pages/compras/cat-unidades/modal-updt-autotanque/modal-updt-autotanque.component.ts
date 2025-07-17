import { Component, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-updt-autotanque',
  templateUrl: './modal-updt-autotanque.component.html',
  styleUrl: './modal-updt-autotanque.component.css'
})
export class ModalUpdtAutotanqueComponent {
  constructor(
    public bsModalRef: BsModalRef,
  ){}

    public event: EventEmitter<any> = new EventEmitter();

    public cerrarModal(): void {
    this.bsModalRef.hide();
    // setTimeout(() => {this.modalCerrado.emit();}, 150)
  }
}
