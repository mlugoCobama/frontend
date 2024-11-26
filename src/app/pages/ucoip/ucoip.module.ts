import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from "angular-datatables";

import { UcoipRoutingModule } from './ucoip-routing.module';
import { UcoipComponent } from './ucoip/ucoip.component';
import { ConfiguracionModule } from './configuracion/configuracion.module';


@NgModule({
  declarations: [
    UcoipComponent
  ],
  imports: [
    CommonModule,
    UcoipRoutingModule,
    ConfiguracionModule,
    DataTablesModule
  ]
})
export class UcoipModule { }
