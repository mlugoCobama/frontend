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
import { PermisosComponent } from './permisos/permisos.component';
import { TablaInventarioComponent } from './inventario/tabla-inventario/tabla-inventario.component';
import { ListResguardosComponent } from './ucoip/modal-ucoip/list-resguardos/list-resguardos.component';
import { ModalUcoipComponent } from './ucoip/modal-ucoip/modal-ucoip.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [
    UcoipComponent,
    InventarioComponent,
    ModalInventarioComponent,
    PermisosComponent,
    TablaInventarioComponent,
    ListResguardosComponent,
    ModalUcoipComponent,
  ],
  imports: [
    CommonModule,
    UcoipRoutingModule,
    ConfiguracionModule,
    DataTablesModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UcoipModule { }
