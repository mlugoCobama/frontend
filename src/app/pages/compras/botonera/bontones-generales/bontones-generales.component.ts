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
  }

  clickRegresar() {
      this.regresar.emit();
  }

  clickNuevo() {
      this.openModalNuevo.emit();
  }

  puedeCrearSolicitud(): boolean {
  return !this.solicitudSelecionada && this.tienePermiso('create solicitud compra');
}

public tienePermiso(permiso: string): boolean {
  const permisosRaw = localStorage.getItem('permisos');
  if (!permisosRaw) return false;
  
  try {
    const permisos = JSON.parse(permisosRaw);
    const lista = permisos.map((p: any) => p.name);
    console.log(lista.includes(permiso))
    return lista.includes(permiso);
  } catch {
    console.log(false);
    return false;
  }
}
}
