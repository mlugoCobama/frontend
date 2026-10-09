import { Component, inject, Input } from '@angular/core';
import { ProveedoresVehiculosService } from 'src/app/core/services/parque-vehicular/proveedores-vehiculos.service';

@Component({
  selector: 'app-diagnostico-vehiculo',
  templateUrl: './diagnostico-vehiculo.component.html',
  styleUrl: './diagnostico-vehiculo.component.css'
})
export class DiagnosticoVehiculoComponent {
  private ordenProveedor = inject(ProveedoresVehiculosService)
  @Input() dataOrdenServicio!:any;

  accordionAbierto: number | null = null;
  public cargando:boolean = false

  toggleAccordion(index: number): void {
    this.accordionAbierto = this.accordionAbierto === index ? null : index;
  }

  verArchivos(prov: any) {
    this.ordenProveedor.abrirArchivo(prov);
  }
}
