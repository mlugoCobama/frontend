import {
  Component, EventEmitter, Input, OnInit,
  OnChanges, Output, ViewChild, SimpleChanges
} from '@angular/core';
import { Config } from 'datatables.net';
import { DataTableDirective } from 'angular-datatables';

export interface ColumnaConfig {
  header: string;           // Texto del encabezado
  field: string;            // Campo del objeto (soporta dot notation: 'tipo.tipo')
  centered?: boolean;       // Alineación centrada
  badge?: BadgeConfig;      // Renderizar como badge
  colorField?: ColorConfig; // Colorear celda según valor
  transform?: (value: any, item?: any) => any;
}

export interface BadgeConfig {
  background?: string ;
  backField?: string ;
  backColorMap?: Record<any, string> ;
  dotField?: string;        // Campo que determina el color del dot (ej: 'estado')
  dotColorMap?: Record<any, string>; // { 1: 'bg-primary', 2: 'bg-success' }
  transform?: (val: any) => string;
}

export interface ColorConfig {
  field: string;            // Campo que determina el color
  colorMap: Record<any, string>; // { 1: 'text-primary', 2: 'text-success' }
  transform?: (val: any) => string; // Transformar el valor mostrado
}

export interface FiltroConfig {
  label: string;            // Placeholder del select
  field: string;            // Campo del objeto a filtrar
  columnIndex: number;      // Columna de datatable a aplicar el search
  opciones?: string[];      // Opciones fijas (si no se usan opciones dinámicas)
  dynamic?: boolean;        // Si true, las opciones se extraen de los datos
}

@Component({
  selector: 'app-datatable-generico',
  templateUrl: './datatable-generico.component.html',
  styleUrl: './datatable-generico.component.css'
})
export class DatatableGenericoComponent implements OnInit, OnChanges {

  @Output() rowClick       = new EventEmitter<any>();
  @Output() rowDoubleClick = new EventEmitter<any>();

  @Input() isLoad   = true;
  @Input() data: any[] = [];
  @Input() columnas: ColumnaConfig[] = [];
  @Input() filtros:  FiltroConfig[]  = [];
  @Input() dtOptions: Config = {
    searching: true, 
    paging: true, 
    info: true, 
    order: [[0, 'asc']],
    language: {
      url: '../assets/es-mx.json'
    },
  };

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  selectedId: number | null = null;

  // Mapa interno: field -> opciones dinámicas
  opcionesDinamicas: Record<string, string[]> = {};

  // Valores actuales de cada filtro
  valoresFiltros: Record<string, string> = {};

  // ─── Ciclo de vida ───────────────────────────────────────────

  ngOnInit(): void {
    this.inicializarFiltros();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Regenerar opciones si llegan datos nuevos
    if (changes['data']) {
      this.inicializarFiltros();
    }
  }

  // ─── Filtros ─────────────────────────────────────────────────

  inicializarFiltros(): void {
    this.filtros.forEach(f => {
      // Inicializar valor vacío
      if (!(f.field in this.valoresFiltros)) {
        this.valoresFiltros[f.field] = '';
        
      }
      // Extraer opciones dinámicas de los datos
      if (f.dynamic) {
        this.opcionesDinamicas[f.field] = [
          ...new Set(this.data.map(item => this.resolveField(item, f.field)))
        ].filter(Boolean).sort();
      }
    });
  }

  aplicarFiltros(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      this.filtros.forEach(f => {
        dtInstance.column(f.columnIndex).search(this.valoresFiltros[f.field] ?? '');
      });
      dtInstance.draw();
    });
  }

  getOpciones(filtro: FiltroConfig): string[] {
    return filtro.dynamic
      ? (this.opcionesDinamicas[filtro.field] ?? [])
      : (filtro.opciones ?? []);
  }

  // ─── Filas ───────────────────────────────────────────────────

  selectRow(item: any): void {
    this.selectedId = item.id;
    this.rowClick.emit(item);
  }

  openEdit(item: any): void {
    this.selectedId = item.id;
    this.rowDoubleClick.emit(item);
  }

  // ─── Helpers de renderizado ──────────────────────────────────

  /** Obtiene el valor de un campo con dot notation: 'tipo.tipo' */
  resolveField(item: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], item);
  }

  /** Devuelve las clases de color para una celda con colorField */
  getColorClass(item: any, col: ColumnaConfig): string {
    if (!col.colorField) return '';
    const val = this.resolveField(item, col.colorField.field);
    return col.colorField.colorMap[val] ?? '';
  }

  /** Devuelve el valor transformado si hay función transform */
  getDisplayValue(item: any, col: ColumnaConfig): string {
    const raw = this.resolveField(item, col.field);
    // Transform del badge
    if (col.badge?.transform) {
      return col.badge.transform(raw);
    }

    if (col.colorField?.transform) {
      return col.colorField.transform(this.resolveField(item, col.colorField.field));
    }
    return raw ?? '';
  }

  /** Clase del dot del badge */
  getBadgeDotClass(item: any, col: ColumnaConfig): string {
    if (!col.badge?.dotColorMap || !col.badge?.dotField) return '';
    const val = this.resolveField(item, col.badge.dotField);
    return col.badge.dotColorMap[val] ?? '';
  }

  getBadgeColorClass(item: any, col: ColumnaConfig): string {
    if (!col.badge?.backColorMap || !col.badge?.backField) return 'text-bg-dark';
    const val = this.resolveField(item, col.badge?.backField);
    return col.badge?.backColorMap[val] ?? 'text-bg-dark';
  }

  getBadgeValue(item: any, col: ColumnaConfig): any {
  const value = this.resolveField(item, col.field);

  if (col.badge?.transform) {
    return col.badge.transform(value);
  }

  return value;
}
}