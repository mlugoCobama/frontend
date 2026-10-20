import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges  } from '@angular/core';
import { EstadoSolicitud } from '../../compras/estado-solicitud.enum';

@Component({
  selector: 'app-bontones-generales',
  templateUrl: './bontones-generales.component.html',
  styleUrl: './bontones-generales.component.css'
})
export class BontonesGeneralesComponent {


  public enEsts = EstadoSolicitud;

  @Input() status:number = 0;
  @Input() mostrarBoton:boolean = false;
  @Input() solicitudSelecionada:any = null;
  @Input() showBtnAdd:boolean = false;

  @Output() btnDescargarOC = new EventEmitter<void>();
  @Output() regresar = new EventEmitter<void>();
  @Output() openModalNuevo = new EventEmitter<void>();

  public clickDescargar() {
      this.btnDescargarOC.emit();
  }

  public clickRegresar() {
      this.regresar.emit();
  }

  public clickNuevo() {
      this.openModalNuevo.emit();
  }

  public puedeCrearSolicitud(): boolean {
  return !this.solicitudSelecionada && this.tienePermiso('create solicitud compra');
}

public tienePermiso(permiso: string): boolean {
  const permisosRaw = localStorage.getItem('permisos');
  if (!permisosRaw) return false;

  try {
    const permisos = JSON.parse(permisosRaw);
    const lista = permisos.map((p: any) => p.name);
    return lista.includes(permiso);
  } catch {
    return false;
  }
}
}
