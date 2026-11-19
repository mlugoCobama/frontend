import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FuncionesTablas } from '../../compras/funciones-tablas';

@Component({
  selector: 'app-tabla-existencias',
  templateUrl: './tabla-existencias.component.html',
  styleUrl: './tabla-existencias.component.css'
})
export class TablaExistenciasComponent implements OnChanges {
  @Input() existencias: any;
  @Input() modelFiltrado: any;
  @Input() ordenador!: FuncionesTablas<any>;
  @Input() isLoad: boolean = false;

  @Output() filaSeleccionada = new EventEmitter();

  public existenciasFiltrados: any = [];
  public   busqueda: string = "";
  public totalDatosFiltrados: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['existencias'] && this.existencias) {
      this.ordenador = new FuncionesTablas(this.existencias);
      this.filtrarTabla();
    }
  }

  filtrarTabla() {
    this.existenciasFiltrados = this.ordenador.filtrar(this.busqueda, this.modelFiltrado);
    this.contarDatos();
  }

  contarDatos() {
    this.totalDatosFiltrados = this.existenciasFiltrados.length;
  }

  ordenarPor(columna: keyof any) {
    this.existenciasFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  trackByProductoId(index: number, item: any) {
    return item.producto_id;
  }

  seleccionar(dato: any, evento: MouseEvent): void {
    const fila = evento.currentTarget as HTMLElement;

    if (fila.classList.contains('table-primary')) {
      fila.classList.remove('table-primary');
      this.filaSeleccionada.emit(null);
    } else {
      document
        .querySelectorAll('tbody tr')
        .forEach((f) => f.classList.remove('table-primary'));
      fila.classList.add('table-primary');
      if(dato.producto_id){
        this.filaSeleccionada.emit(dato);
      }
    }
  }
}
