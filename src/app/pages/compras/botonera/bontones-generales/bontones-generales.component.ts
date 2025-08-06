import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges  } from '@angular/core';
import { EstadoSolicitud } from '../../compras/estado-solicitud.enum';

@Component({
  selector: 'app-bontones-generales',
  templateUrl: './bontones-generales.component.html',
  styleUrl: './bontones-generales.component.css'
})
export class BontonesGeneralesComponent {

  
  public enEsts = EstadoSolicitud;
  
  @Input() status:any;
  @Input() mostrarBoton:any;
  @Input() solicitudSelecionada:any = null;

  @Output() btnDescargarOC = new EventEmitter<void>();
  @Output() regresar = new EventEmitter<void>();
  @Output() openModalNuevo = new EventEmitter<void>();
      
  clickDescargar() {
      this.btnDescargarOC.emit();
      console.info('clickDescargar')
  }

  clickRegresar() {
      this.regresar.emit();
      console.info('clickRegresar')
  }

  clickNuevo() {
      console.info('clickNuevo')
      this.openModalNuevo.emit();
  }

}
