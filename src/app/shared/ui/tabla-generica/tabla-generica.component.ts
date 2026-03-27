import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { PermisosService } from 'src/app/core/services/permisos.service';

export interface ColumnaTabla {
  campo: string;
  etiqueta: string;
  pipe?: 'percent' | 'currency' | 'date' | null;
  pipeArgs?: 'left' | 'center' | 'right' | null;
  align?: string;
  textColor?: 'success' | 'primary' | 'danger' | 'warning' |null;
  bold?: boolean;
}

export interface OpcionSelect {
  valor: any;
  etiqueta: string;
}

export interface AccionTabla {
  icono: string;         // clase del ícono ej: 'fas fa-edit'
  clase: string;         // clase del botón ej: 'btn-warning'
  tooltip?: string;      // texto del tooltip
  permiso?: string;      // permiso para usar el boton
  accion: (item: any) => Promise<void> | void; // función a ejecutar
  visible?: (item: any) => boolean;
}

@Component({
  selector: 'app-tabla-generica',
  templateUrl: './tabla-generica.component.html',
  styleUrl: './tabla-generica.component.css', 
})
export class TablaGenericaComponent implements OnInit, OnChanges {

  /** Datos originales a mostrar */
  @Input() data: any[] = [];

  /** Definición de columnas */
  @Input() columnas: ColumnaTabla[] = [];

  /** Altura máxima del contenedor */
  @Input() maxHeight: string = '28rem';

  /** Indica si está cargando */
  @Input() isLoad: boolean = false;

  // --- SELECT ---
  /** Mostrar u ocultar el select */
  @Input() mostrarSelect: boolean = false;

  /** Opciones del select */
  @Input() opcionesSelect: OpcionSelect[] = [];

  /** Placeholder del select (default: 'Seleccione uno') */
  @Input() placeholderSelect: string = 'Seleccione uno';

  @Output() itemsSeleccionados = new EventEmitter<any[]>(); 

  /** Emite el valor seleccionado en el select */
  @Output() selectCambiado = new EventEmitter<any>();

  /** Emite el item de la tabla seleccionado */
  @Output() itemSeleccionado = new EventEmitter<any | null>();

  @Input() mostrarCheck: boolean = false;

  @Input() acciones: AccionTabla[] = [];

  public valorSelect: any = '';
  public datosFiltrados: any[] = [];
  public busqueda: string = '';
  public ordenador: any;

  public seleccionados: Set<any> = new Set(); // items con check activo
  public todosMarcados: boolean  = false;

  public loadingFilas: Map<number, Set<number>> = new Map();

  get tieneAcciones(): boolean {
    return this.acciones.length > 0;
  }


  estaEnLoading(indexFila: number, indexAccion: number): boolean {
  return this.loadingFilas.get(indexFila)?.has(indexAccion) ?? false;
}

async ejecutarAccion(
  accion: AccionTabla,
  item: any,
  indexFila: number,
  indexAccion: number,
  evento: MouseEvent
): Promise<void> {
  evento.stopPropagation();

  // Activar spinner solo en esta fila + acción
  if (!this.loadingFilas.has(indexFila)) {
    this.loadingFilas.set(indexFila, new Set());
  }
  this.loadingFilas.get(indexFila)!.add(indexAccion);

  try {
    await accion.accion(item);
  } finally {
    // Desactivar spinner al terminar (éxito o error)
    this.loadingFilas.get(indexFila)?.delete(indexAccion);
  }
}

esVisible(accion: AccionTabla, item: any): boolean {
  // Si no tiene condición, siempre visible
  return accion.visible ? accion.visible(item) : true;
}
  constructor(private permisosService: PermisosService){}

  ngOnInit(): void {
    this.ordenador = new FuncionesTablas(this.data);
    this.datosFiltrados = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.ordenador = new FuncionesTablas(this.data);
      this.datosFiltrados = [...this.data];
      this.busqueda = '';
      this.seleccionados.clear();
      this.todosMarcados  = false;
    }
  }

  get camposFiltro(): string[] {
    return this.columnas.map((c) => c.campo);
  }

  seleccionar(dato: any, evento: MouseEvent): void {
    const fila = evento.currentTarget as HTMLElement;

    if (fila.classList.contains('table-primary')) {
      fila.classList.remove('table-primary');
      this.itemSeleccionado.emit(null);
    } else {
      document
        .querySelectorAll('tbody tr')
        .forEach((f) => f.classList.remove('table-primary'));
      fila.classList.add('table-primary');
      this.itemSeleccionado.emit(dato);
    }
  }

  ordenarPor(columna: string): void {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: string): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla(): void {
    this.datosFiltrados = this.ordenador.filtrar(
      this.busqueda,
      this.camposFiltro
    );
  }

   // ─── Checkboxes ────────────────────────────────────────────────
  toggleCheck(item: any, checked: boolean): void {
    checked ? this.seleccionados.add(item) : this.seleccionados.delete(item);
    this.todosMarcados = this.seleccionados.size === this.datosFiltrados.length;
    this.itemsSeleccionados.emit(this.getSeleccionados());
  }

  toggleTodos(checked: boolean): void {
    this.todosMarcados = checked;
    checked
      ? this.datosFiltrados.forEach(i => this.seleccionados.add(i))
      : this.seleccionados.clear();
    this.itemsSeleccionados.emit(this.getSeleccionados());
  }

  estaSeleccionado(item: any): boolean {
    return this.seleccionados.has(item);
  }

  getSeleccionados(): any[] {
    return Array.from(this.seleccionados);
  }

  limpiarSeleccion(): void {
    this.seleccionados.clear();
    this.todosMarcados = false;
    this.itemsSeleccionados.emit([]);
  }

  // ejecutarAccion(accion: AccionTabla, item: any, evento: MouseEvent): void {
  //   evento.stopPropagation(); // evita que dispare el click de la fila
  //   accion.accion(item);
  // }


  onSelectChange(): void {
    this.selectCambiado.emit(this.valorSelect);
  }
  
    tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  
}