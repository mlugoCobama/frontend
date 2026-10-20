import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceComponent } from './services/local-storage-service/local-storage-service.component';
import { PuestosComponent } from './services/capacitaciones/puestos/puestos.component';
import { TomaUnidadesComponent } from './services/renault/toma-unidades/toma-unidades.component';
import { EventosCitaComponent } from './services/renault/eventos-cita/eventos-cita.component';

@NgModule({
  declarations: [
    LocalStorageServiceComponent,
    PuestosComponent,
    TomaUnidadesComponent,
    EventosCitaComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
