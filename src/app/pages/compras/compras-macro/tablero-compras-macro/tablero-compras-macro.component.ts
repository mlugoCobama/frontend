import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FuncionesTablas } from '../../compras/funciones-tablas';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-tablero-compras-macro',
  templateUrl: './tablero-compras-macro.component.html',
  styleUrl: './tablero-compras-macro.component.css'
})
export class TableroComprasMacroComponent {
  @Input() vistaKanban: boolean = false;
  @Input() isLoad: boolean = false;
  @Input() data = [];
  @Input() modelBusqueda:any[] = [];

  @Output() openDetalle =  new EventEmitter();
  @Output() openOrdenCompra =  new EventEmitter();
  @Output() openSeguimiento =  new EventEmitter();


  datosFiltrados: any[] = [];
  private ordenador!: any;
  busqueda: string = "";
  busqueda2: string = "";

  private permisosService =  inject(PermisosService)

   ngOnChanges(changes: SimpleChanges): void {
      if (changes['data'] && this.data) {
        this.ordenador = new FuncionesTablas(this.data);
        this.filtrarTabla();
      }
    }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, this.modelBusqueda);
  }

  ordenarPor(columna: keyof any) {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  openDetallesSolicitud(dato:any){
    this.openDetalle.emit(dato);
  }

  openModalSeguimiento(dato:any){
    this.openSeguimiento.emit(dato);
  }

  openModalOC(dato:any){
    this.openOrdenCompra.emit(dato);
  }
}
