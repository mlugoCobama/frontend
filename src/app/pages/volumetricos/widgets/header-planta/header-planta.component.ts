import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-planta',
  templateUrl: './header-planta.component.html',
  styleUrl: './header-planta.component.css'
})
export class HeaderPlantaComponent {
  @Input() descripcionInstalacion  = '';
  @Input() numPermiso = '';
  @Input() versionJson = '';
  @Input() fechaReporte = '';
}
