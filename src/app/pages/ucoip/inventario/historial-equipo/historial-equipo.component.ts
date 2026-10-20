import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MantenimientoService } from 'src/app/core/services/ucoip/mantenimiento.service';

@Component({
  selector: 'app-historial-equipo',
  templateUrl: './historial-equipo.component.html',
  styleUrl: './historial-equipo.component.css'
})
export class HistorialEquipoComponent implements OnInit{
 @Input() data: any;
  @Output() verCompra = new EventEmitter<any>();

  tabActiva: 'asignaciones' | 'mantenimientos' | 'intercambios' | 'modificaciones' = 'asignaciones';

  filaExpandidaId: number | null = null;
  detalle: any = null;
  loadingDetalle = false;

   @Input() checklistCatalogo: any[] = [];
  checklistCatalogoCargado = true;

  constructor(private mantenimientoService: MantenimientoService) {}

   ngOnInit(): void {}


  openCompra(item: any) {
    this.verCompra.emit(item);
  }

    get totalCostoUnitario(): number {
  return this.data?.cambiosHardware?.reduce((total: number, item: any) => {
    return total + (Number(item.costo_unitario) || 0);
  }, 0) ?? 0;
  }

  get totalCostoTotal(): number {
    return this.data?.cambiosHardware?.reduce((total: number, item: any) => {
      return total + (Number(item.costo_total) || 0);
    }, 0) ?? 0;
  }

  esPreventivo(tipo: string): boolean {
    return String(tipo) === '1';
  }

  toggleDetalle(mantenimiento: any): void {
    // Si ya estaba abierta esta fila, se cierra (toggle) sin volver a pedir nada
    if (this.filaExpandidaId === mantenimiento.id) {
      this.filaExpandidaId = null;
      this.detalle = null;
      return;
    }

    this.filaExpandidaId = mantenimiento.id;
    this.detalle = null;
    this.loadingDetalle = true;

    // Carga el catálogo del checklist solo la primera vez que se expande algo
    // if (!this.checklistCatalogoCargado) {
    //   this.mantenimientoService.getChecklistMantenimiento().subscribe({
    //     next: (response) => {
    //       this.checklistCatalogo = response?.data ?? [];
    //       this.checklistCatalogoCargado = true;
    //     },
    //     error: () => this.checklistCatalogo = []
    //   });
    // }

    this.mantenimientoService.obtenerPorId(mantenimiento.id).subscribe({
      next: (response) => {
        this.detalle = response.data;
        this.loadingDetalle = false;
      },
      error: () => {
        this.loadingDetalle = false;
      }
    });
  }

  checklistMarcados(): any[] {
    if (!this.detalle?.checklist) return [];
    return this.checklistCatalogo.filter(
      item => this.detalle.checklist[item.codigo_control] === true
    );
  }
}
