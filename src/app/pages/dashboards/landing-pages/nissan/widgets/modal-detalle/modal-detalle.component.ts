import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";


@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrl: './modal-detalle.component.css'
})
export class ModalDetalleComponent implements OnInit{
public event: EventEmitter<any> = new EventEmitter();
public concepto:any;
public tipo: any = 'agencias';
public isLoad:boolean = true;
constructor(
  public modalRef: BsModalRef
){}
 
ngOnInit(): void {
   setTimeout(()=>{this.isLoad = false},100);
}

public formatearTexto(texto){
  const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
  let textoFormateado = capitalCaseText.replace("_", " ")
  return textoFormateado;
}


}
