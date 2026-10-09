import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-diagnostico-vehiculo',
  templateUrl: './diagnostico-vehiculo.component.html',
  styleUrl: './diagnostico-vehiculo.component.css'
})
export class DiagnosticoVehiculoComponent {
  @Input() dataOrdenServicio!:any;

  accordionAbierto: number | null = null;

  toggleAccordion(index: number): void {
    this.accordionAbierto = this.accordionAbierto === index ? null : index;
  }
}
