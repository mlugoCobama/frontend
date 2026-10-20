import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProveedorOption {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-proveedor-selector',
  templateUrl: './proveedor-selector.component.html',
  styleUrl: './proveedor-selector.component.css'
})
export class ProveedorSelectorComponent {

  /** Lista de proveedores recibida desde el componente padre */
  @Input() proveedores: ProveedorOption[] = [];

  /** Proveedor asignado actualmente (opcional, para preseleccionar) */
  @Input() proveedorIdActual: number | null = null;

  /** Deshabilitar el botón/select mientras se procesa una petición */
  @Input() cargando: boolean = false;

  /** Emisor de evento al hacer clic en Asignar */
  @Output() onAsignar = new EventEmitter<number>();

  /** ID seleccionado en el <select> */
  proveedorSeleccionadoId: number | null = null;

  ngOnInit(): void {
    if (this.proveedorIdActual) {
      this.proveedorSeleccionadoId = this.proveedorIdActual;
    }
  }

  asignarProveedor(): void {
    if (this.proveedorSeleccionadoId) {
      this.onAsignar.emit(Number(this.proveedorSeleccionadoId));
    }
  }

}
