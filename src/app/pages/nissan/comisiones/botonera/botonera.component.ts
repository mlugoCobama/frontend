import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-botonera',
  templateUrl: './botonera.component.html',
  styleUrl: './botonera.component.css'
})
export class BotoneraComponent {
  @Input() estado:any = 0;

  @Input() guardandoE: boolean = false;
  @Input() guardandoV: boolean = false;
  @Input() guardandog: boolean = false;

  @Output() saveEntregados = new EventEmitter<void>();
  @Output() saveValidados = new EventEmitter<void>();
  @Output() saveGastos = new EventEmitter<void>();

  public guardarEntregados(){
    this.saveEntregados.emit();
  }

  public guardarGastos(){
    this.saveGastos.emit();
  }

  public guardarValidados(){
    this.saveValidados.emit();
  }

}
