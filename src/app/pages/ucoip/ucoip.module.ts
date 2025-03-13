import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from "angular-datatables";

import { UcoipRoutingModule } from './ucoip-routing.module';
import { UcoipComponent } from './ucoip/ucoip.component';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { InventarioComponent } from './inventario/inventario.component';
import { ModalInventarioComponent } from './inventario/modal-inventario/modal-inventario.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UcoipComponent,
    InventarioComponent,
    ModalInventarioComponent
  ],
  imports: [
    CommonModule,
    UcoipRoutingModule,
    ConfiguracionModule,
    DataTablesModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UcoipModule { }
