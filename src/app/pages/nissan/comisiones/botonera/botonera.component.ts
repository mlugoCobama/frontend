import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { permisosComisonsionesVentasNuevos } from 'src/app/shared/constants/permisos';

@Component({
  selector: 'app-botonera',
  templateUrl: './botonera.component.html',
  styleUrl: './botonera.component.css'
})
export class BotoneraComponent {

  constructor(private permisosService: PermisosService){}
  
  public permisos = permisosComisonsionesVentasNuevos;
  @Input() estado:any = 0;

  @Input() guardandoE: boolean = false;
  @Input() guardandoV: boolean = false;
  @Input() guardandoG: boolean = false;
  @Input() guardandoBdc: boolean = false;
  @Input() guardandovBdc: boolean = false;

  @Output() saveEntregados = new EventEmitter<void>();
  @Output() saveValidados = new EventEmitter<void>();
  @Output() saveGastos = new EventEmitter<void>();
  @Output() saveValidadosBdc = new EventEmitter<void>();
  @Output() saveBdc = new EventEmitter<void>();

  public guardarEntregados(){
    this.saveEntregados.emit();
  }

  public guardarGastos(){
    this.saveGastos.emit();
  }

  public guardarValidados(){
    this.saveValidados.emit();
  }

  public guardarValidadosBDC(){
    this.saveValidadosBdc.emit();
  }
  public guardarBDC(){
    this.saveBdc.emit();
  }

    /** Validador de permisos */
  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
  
}
