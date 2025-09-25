import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageServiceComponent } from './services/local-storage-service/local-storage-service.component';
import { PuestosComponent } from './services/capacitaciones/puestos/puestos.component';

@NgModule({
  declarations: [
    LocalStorageServiceComponent,
    PuestosComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
