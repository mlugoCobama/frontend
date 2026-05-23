import { PermisosService } from 'src/app/core/services/permisos.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';

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
  { id: 1, nombre: 'En espera de autorización', color: 'bg-gradient bg-info', permiso: 'view column esp auto'},
  { id: 2, nombre: 'Solicitado', color: 'bg-gradient bg-info', permiso: 'view column solicitado'},
  { id: 3, nombre: 'En cotización', color: 'bg-gradient bg-warning', permiso: 'view column en cotizacion'},
  { id: 5, nombre: 'Orden de compra', color: 'bg-gradient bg-warning', permiso: 'view column orden compra'},
  { id: 6, nombre: 'Autorizado', color: 'bg-gradient bg-success', permiso: 'view column autorizado'},
  { id: 7, nombre: 'Autorizado a pago', color: 'bg-gradient bg-primary', permiso: 'view column autorizado a pago'},
  { id: 8, nombre: 'En surtido', color: 'bg-gradient bg-primary', permiso: 'view column en surtido'},
  { id: 10, nombre: 'Por facturar', color: 'bg-gradient bg-primary', permiso: 'view column facturado'},
  { id: 11, nombre: 'Pago Solicitado', color: 'bg-gradient bg-warning', permiso: 'view column solicitado a pago'},
  { id: 12, nombre: 'Pagada', color: 'bg-gradient bg-success', permiso: 'view column pagada'},
  { id: 13, nombre: 'Cargar complemento', color: 'bg-gradient bg-secondary', permiso: 'view column cargar complemento'},
  { id: 9, nombre: 'Entregada Parcialmente', color: 'bg-gradient bg-secondary', permiso: 'view column entregado'},
  { id: 14, nombre: 'Finalizada', color: 'bg-gradient bg-dark', permiso: 'view column finalizada'},
  { id: 4, nombre: 'Cancelado', color: 'bg-gradient bg-danger', permiso: 'view column cancelado'},
];

agrupaciones = {
  'En espera de autorización': ['ESP. AUT. PLANTA', 'ESP. AUT. MACRO'],
  'Solicitado': ['SOLICITADO'],
  'En cotización': ['EN COTIZACIÓN'],
  'Orden de compra': ['ORDEN DE COMPRA'],
  'Autorizado' : ['AUTORIZADA'],
  'Autorizado a pago' : ['AUTO. A PAGO'],
  'En surtido': ['EN SURTIDO'],
  'Entregada Parcialmente': ['ENTREGADO PARCIALMENTE'],
  'Por facturar': ['POR FACTURAR'],
  'Pago Solicitado': ['PAGO SOLICITADO'],
  'Pagada': ['PAGADO'],
  'Cargar complemento': ['CARGA COMPLEMENTO'],
  'Finalizada': ['FINALIZADO'],
  'Cancelado': ['CANCELADA']
};


  constructor(
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    // this.agruparPorEstado();
    this.agruparPorEstadoTexto();
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

  agruparPorEstadoTexto() {
  this.datosAgrupados = {};

  Object.keys(this.agrupaciones).forEach((grupo) => {
    const nombres = this.agrupaciones[grupo];

    this.datosAgrupados[grupo] = this.datos.filter((d) =>
      nombres.includes(d.estado)
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

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  
//  diferenciaEnDias(fechaStr: string): number {
//   // fechaStr espera formato "dd/mm/aaaa"
//   const partes = fechaStr.split("/"); // ["dd", "mm", "aaaa"]

//   // Parsear a números
//   const dia = parseInt(partes[0], 10);
//   const mes = parseInt(partes[1], 10) - 1; // los meses en JS van 0–11
//   const anio = parseInt(partes[2], 10);

//   const fechaEspecifica = new Date(anio, mes, dia);
//   const hoy = new Date();

//   const unDiaEnMs = 1000 * 60 * 60 * 24;

//   const diferenciaMs = hoy.getTime() - fechaEspecifica.getTime();

//   return Math.round(diferenciaMs / unDiaEnMs);
// }

// getColorPorDias(fechaStr: string): string {
//   const dias = this.diferenciaEnDias(fechaStr);

//   if (dias <= 2) {
//     return '';
//   } else if (dias >= 3 && dias <= 6) {
//     return "bg-warning";
//   } else if (dias >= 7) {
//     return "bg-danger";
//   } else {
//     return "bg-dark"; // sin clase
//   }
// }


}