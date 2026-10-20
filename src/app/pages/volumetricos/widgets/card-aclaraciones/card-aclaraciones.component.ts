import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-aclaraciones',
  templateUrl: './card-aclaraciones.component.html',
  styleUrl: './card-aclaraciones.component.css'
})
export class CardAclaracionesComponent {
  @Input() title = '';
  @Input() volumenSinCfdi = 0;
  @Input() volumenTraspaso = 0;
  @Input() volumenAutoconsumo = 0;

  calcularPorcentaje(valor: number): number {
    const total = (this.volumenSinCfdi || 0) + (this.volumenTraspaso || 0) + (this.volumenAutoconsumo || 0);
    return total > 0 ? (valor / total) * 100 : 0;
  }
}
