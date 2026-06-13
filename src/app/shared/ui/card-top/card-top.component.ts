import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card-top',
  templateUrl: './card-top.component.html',
  styleUrl: './card-top.component.css'
})
export class CardTopComponent {

  @Input() title:string = '';

  @Input() hasButtons : boolean = false;
  @Input() showBtnNuevo : boolean = false;
  @Input() showBtnEditar : boolean = false;
  @Input() showBtnEliminar : boolean = false;
  @Input() showBtnVolver : boolean = false;

  @Output() nuevo = new EventEmitter<void>();
  @Output() actualizar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();

  clickNuevo(){
    this.nuevo.emit();
  }

  clickEditar(){
    this.actualizar.emit();
  }

  clickEliminar(){
    this.eliminar.emit();
  }
  
  clickVolver(){
    this.volver.emit();
  }

}
