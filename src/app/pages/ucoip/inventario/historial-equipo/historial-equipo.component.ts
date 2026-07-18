import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-historial-equipo',
  templateUrl: './historial-equipo.component.html',
  styleUrl: './historial-equipo.component.css'
})
export class HistorialEquipoComponent {
 @Input() data: any;
  @Output() verCompra = new EventEmitter<any>();

  tabActiva: 'asignaciones' | 'intercambios' | 'modificaciones' = 'asignaciones';

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
}
