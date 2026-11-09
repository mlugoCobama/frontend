import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-proveedores-multiselect',
  templateUrl: './proveedores-multiselect.component.html',
  styleUrl: './proveedores-multiselect.component.css'
})
export class ProveedoresMultiselectComponent {
  private host = inject(ElementRef<HTMLElement>);

  @Input() opciones: any[] = [];
  @Input() max = 3;
  @Input() idKey = 'id';
  @Input() labelKey = 'nombre';
  @Input() placeholder = 'Seleccionar proveedores...';
  @Input() disabled = false;
  filtroTexto: string = '';

  @Input() seleccionados: any[] = [];
  @Output() seleccionadosChange = new EventEmitter<any[]>();

  /** Se emite cuando el usuario intenta pasar del máximo permitido. */
  @Output() limiteAlcanzado = new EventEmitter<number>();

  abierto = false;

  get limiteLleno(): boolean {
    return this.seleccionados.length >= this.max;
  }

  get textoBoton(): string {
    const n = this.seleccionados.length;
    return n === 0 ? this.placeholder : `${n} proveedor(es) seleccionado(s)`;
  }

  estaSeleccionado(opcion: any): boolean {
    return this.seleccionados.some((s) => s[this.idKey] === opcion[this.idKey]);
  }

  /** Deshabilita los no marcados cuando ya se llegó al máximo. */
  estaBloqueado(opcion: any): boolean {
    return this.limiteLleno && !this.estaSeleccionado(opcion);
  }

  trackById = (_: number, opcion: any) => opcion[this.idKey];

  toggleMenu(): void {
    if (this.disabled) return;
    this.abierto = !this.abierto;
  }

  toggle(opcion: any, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (this.limiteLleno) {
        input.checked = false; // revierte el check visual
        this.limiteAlcanzado.emit(this.max);
        return;
      }
      this.emitir([...this.seleccionados, opcion]);
    } else {
      this.emitir(this.seleccionados.filter((s) => s[this.idKey] !== opcion[this.idKey]));
    }
  }

  limpiar(): void {
    this.emitir([]);
  }

  private emitir(lista: any[]): void {
    this.seleccionados = lista;
    this.seleccionadosChange.emit(lista);
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent): void {
    if (this.abierto && !this.host.nativeElement.contains(event.target)) {
      this.abierto = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.abierto = false;
  }

  get opcionesFiltradas() {
  if (!this.filtroTexto || !this.filtroTexto.trim()) {
    return this.opciones;
  }

  const textoBusqueda = this.filtroTexto.toLowerCase().trim();

  return this.opciones.filter(op => {
    const valorLabel = op[this.labelKey] ? String(op[this.labelKey]).toLowerCase() : '';
    return valorLabel.includes(textoBusqueda);
  });
}
}

