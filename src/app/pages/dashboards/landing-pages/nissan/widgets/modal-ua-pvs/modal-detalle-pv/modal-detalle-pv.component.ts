import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';

@Component({
  selector: 'app-modal-detalle-pv',
  templateUrl: './modal-detalle-pv.component.html',
  styleUrl: './modal-detalle-pv.component.css'
})
export class ModalDetallePvComponent implements OnInit{
public event: EventEmitter<any> = new EventEmitter();
public concepto:any;
public tipo: any = 'agencias';
public isLoad:boolean = true;
public dataEnergeticos:any;
public copiaData:any;
public concepto2:any;
public agencia:any;
public id:any;
public mes:any;

constructor(
  public modalRef: BsModalRef,
  public gaseras:EnergeticosGaserasService
){}
 
ngOnInit(): void {
  this.concepto2 = this.concepto;
   setTimeout(()=>{this.isLoad = false},1200);
  }

  public actualizarConcepto(concepto){
    this.concepto2 =  concepto;
    this.gaseras.actualizarData();
  }
}
