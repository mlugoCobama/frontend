
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { event } from 'jquery';

interface SolicitudCompra {
  id: number;
  folio: string;
  folio_oc?: string;
  empresa?: string;
  usuario_solicita: string;
  usuario_destino?: string;
  eco?:string,
  serie?:string,
  centro_costo?: string;
  fecha: string;
  proveedor?: string;
  total_orden: number;
  estado: string;
  claseEstado: string;
  estatus: number;
  c_c?: number;
}

@Component({
  selector: 'app-compras-kanban',
  templateUrl: './compras-kanban.component.html',
  styleUrl: './compras-kanban.component.css'
})
export class ComprasKanbanComponent implements OnInit, OnChanges {

  @Output() btnModalSeguimiento = new EventEmitter<void>();
  @Output() btnModalOC = new EventEmitter<void>();
  @Output() btnOpenDetalleSolicitud = new EventEmitter<void>();
      
  isLoad = true;
  @Input() datos: SolicitudCompra[] = [];
  datosAgrupados: { [key: string]: SolicitudCompra[] } = {};

  estados = [
  { id: 1, nombre: 'En espera de autorización', color: 'bg-info' },
  { id: 2, nombre: 'Solicitado', color: 'bg-info' },
  { id: 3, nombre: 'En cotización', color: 'bg-warning' },
  { id: 4, nombre: 'Cancelado', color: 'bg-danger' },
  { id: 5, nombre: 'Orden de compra', color: 'bg-warning' },
  { id: 6, nombre: 'Autorizado', color: 'bg-success' },
  { id: 7, nombre: 'Autorizado a pago', color: 'bg-primary' },
  { id: 8, nombre: 'En surtido', color: 'bg-primary' },
  { id: 9, nombre: 'Entregada', color: 'bg-dark' },
  { id: 10, nombre: 'Facturado', color: 'bg-primary' },
  { id: 11, nombre: 'Solicitado pago', color: 'bg-warning' },
  { id: 12, nombre: 'Pagada', color: 'bg-success' },
  { id: 13, nombre: 'Cargar complemento', color: 'bg-secondary' },
  { id: 14, nombre: 'Finalizada', color: 'bg-dark' }
];


  constructor(
  ) {}

  ngOnInit(): void {
    this.agruparPorEstado();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && changes['datos'].currentValue) {
      this.agruparPorEstado();
    }
  }

  agruparPorEstado() {
    this.datosAgrupados = {};
    this.estados.forEach((estado) => {
      this.datosAgrupados[estado.nombre] = this.datos.filter(
        (d) => d.estatus === estado.id
      );
    });
    this.isLoad = false;
  }

  openModalSeguimiento(item: any) {
    this.btnModalSeguimiento.emit(item);
  }
  openModalOC(item: any) {
    this.btnModalOC.emit(item);
  }
  openDetallesSolicitud(item: any, e: any) {
    this.btnOpenDetalleSolicitud.emit(item);
  }

  validarAutorizaciones(item){
    let resultado = false;

    if(item.tipo === 1 || item.tipo === 3) {
      resultado = (item.auto_admin == 0 || item.auto_gg == 0) ? true : false ;
    }

    if(item.tipo === 2){
      resultado = (item.auto_admin == 0 || item.auto_gg == 0 || item.auto_macro == 0 ) ? true : false ;
    }

    return resultado;
  }
}