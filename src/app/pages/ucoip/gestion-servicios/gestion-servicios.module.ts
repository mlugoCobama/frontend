import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionServiciosRoutingModule } from './gestion-servicios-routing.module';
import { DashboardServiciosComponent } from './dashboard-servicios/dashboard-servicios.component';


@NgModule({
  declarations: [
    DashboardServiciosComponent
  ],
  imports: [
    CommonModule,
    GestionServiciosRoutingModule
  ]
})
export class GestionServiciosModule { }
