import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-autorizacion',
  templateUrl: './btn-autorizacion.component.html',
  styleUrl: './btn-autorizacion.component.css'
})
export class BtnAutorizacionComponent {
  @Input() title:string = 'Autorizacion';
  @Input() instrucciones:string = '';
  @Input() btnConfirmLabel:string = 'Autorizar';
  @Input() btnDenyLabel:string = 'Rechazar';
  @Input() showButtonDeny:boolean = true;

  @Input() loadingConfirm:boolean = false;
  @Input() loadingDeny:boolean = false;

  @Output() confirm = new EventEmitter<any>();
  @Output() deny = new EventEmitter<any>();

  public clickConfirm(){
    this.loadingConfirm = true;
    this.confirm.emit();
  }

  public clickDeny(){
    this.loadingDeny = true;
    this.deny.emit();
  }
}
