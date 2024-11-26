import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-sabana-control',
  templateUrl: './modal-sabana-control.component.html',
  styleUrls: ['./modal-sabana-control.component.css']
})
export class ModalSabanaControlComponent {
  /**
   * Titulo que contendra el moda
   */
  public title :string = '';
  /**
   * variable para regresar el evento
   */
  public event: EventEmitter<any> = new EventEmitter();

  public data: any;

  public constructor(
    public bsModalRef: BsModalRef,

    )
  {}
  /**
   * Funcion para cerrar el modal
   */
  public cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
