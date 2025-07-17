import { Component, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-modal-add-autotanque',
  templateUrl: './modal-add-autotanque.component.html',
  styleUrl: './modal-add-autotanque.component.css'
})
export class ModalAddAutotanqueComponent {

  constructor(
    public bsModalRef: BsModalRef,
  ){}

    public event: EventEmitter<any> = new EventEmitter();

    public cerrarModal(): void {
    this.bsModalRef.hide();
    // setTimeout(() => {this.modalCerrado.emit();}, 150)
  }
}
