import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-tablero-compras',
  templateUrl: './tablero-compras.component.html',
  styleUrl: './tablero-compras.component.css'
})
export class TableroComprasComponent implements OnChanges{
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
