import { Component, Input, EventEmitter, Output  } from '@angular/core';
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
  @Input() solicitudSelecionada:any;

  @Output() btnDescargarOC = new EventEmitter<void>();
  @Output() regresar = new EventEmitter<void>();
  @Output() openModalNuevo = new EventEmitter<void>();
      
  clickDescargar() {
      this.btnDescargarOC.emit();
  }

  clickRegresar() {
      this.regresar.emit();
  }

  clickNuevo() {
      this.openModalNuevo.emit();
  }

}
