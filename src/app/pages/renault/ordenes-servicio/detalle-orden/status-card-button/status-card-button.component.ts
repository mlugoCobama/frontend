import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-card-button',
  templateUrl: './status-card-button.component.html',
  styleUrl: './status-card-button.component.css'
})
export class StatusCardButtonComponent {
  /** Título de la tarjeta */
  @Input() title: string = 'Proceso de Lavado';

  /** Descripción opcional o estado secundario */
  @Input() description?: string;

  /** Controla si la acción está activa para alternar estado visual */
  @Input() isActive: boolean = false;
  @Input() isCompleted: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() observaciones?: string;
  /** Texto cuando el proceso NO ha iniciado */
  @Input() startLabel: string = 'Iniciar proceso';

  /** Texto cuando el proceso SÍ está activo */
  @Input() stopLabel: string = 'Finalizar proceso';

  /** Emite el evento con el nuevo estado deseado */
  @Output() actionToggled = new EventEmitter<boolean>();

  toggleAction(): void {
    if (!this.isLoading && !this.isCompleted) {
      this.actionToggled.emit(!this.isActive);
    }
  }
}
