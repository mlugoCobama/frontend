import { Component, EventEmitter, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Subscription } from 'rxjs';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';

@Component({
  selector: 'app-modal-detalle-pv',
  templateUrl: './modal-detalle-pv.component.html',
  styleUrl: './modal-detalle-pv.component.css',
})
export class ModalDetallePvComponent implements AfterViewInit{
private actualizarDatosSubscripcion: Subscription;
  
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
 
ngAfterViewInit(): void {
  this.concepto2 = this.concepto;

   setTimeout(()=>{this.isLoad = false},100);
  }

  public actualizarConcepto(concepto){
    this.gaseras.actualizarData();
    this.concepto2 =  concepto;
  }
}
