import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-identification-card',
  templateUrl: './identification-card.component.html',
  styleUrl: './identification-card.component.css'
})
export class IdentificationCardComponent {
   @Input() rfcContribuyente: string = '';
  @Input() rfcRepLegal: string = '';
  @Input() caracter: string = '';
  @Input() modalidadPermiso: string = '';
  @Input() claveInstalacion: string = '';

  // Geolocalización
  @Input() latitud: number | null = null;
  @Input() longitud: number | null = null;
}
