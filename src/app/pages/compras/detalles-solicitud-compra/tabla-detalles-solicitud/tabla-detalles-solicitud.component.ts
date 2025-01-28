import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'jquery';

@Component({
  selector: 'app-tabla-detalles-solicitud',
  templateUrl: './tabla-detalles-solicitud.component.html',
  styleUrls: ['./tabla-detalles-solicitud.component.css']
})
export class TablaDetallesSolicitudComponent {
 @Input() detalles:any[] = [];
 @Input() cotProv:any[] = [];
 @Input() totals:any = {};
 @Input() totalMasBajo: number| null = null;
 @Input() mostrarTotal : boolean = false;
 @Input() isLoad : boolean = false;

 @Output() updatePrices = new EventEmitter <void>();
 @Output() validateInput = new EventEmitter <Event>();
 @Output() openModal = new EventEmitter <string>();

 actualizarPrecios(){
  this.updatePrices.emit();
 }

 validacionInput(event: Event){
  this.validateInput.emit(event);
 }

 verReferencia(image: string){
  this.openModal.emit(image);
 }
}
