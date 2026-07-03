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
import { CardInfoUcoipComponent } from './ucoip/modal-ucoip/card-info-ucoip/card-info-ucoip.component';
import { CardNetworkComponent } from './ucoip/modal-ucoip/card-network/card-network.component';
import { CardSistemasComponent } from './ucoip/modal-ucoip/card-sistemas/card-sistemas.component';
import { CardLicenciamientosComponent } from './ucoip/modal-ucoip/card-licenciamientos/card-licenciamientos.component';
import { SoftwareComponent } from './software/software.component';
import { TokensAgenciasComponent } from './tokens-agencias/tokens-agencias.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ModalSoftwareComponent } from './software/modal-software/modal-software.component';

@NgModule({
  declarations: [
    UcoipComponent,
    InventarioComponent,
    ModalInventarioComponent,
    PermisosComponent,
    TablaInventarioComponent,
    ListResguardosComponent,
    ModalUcoipComponent,
    CardInfoUcoipComponent,
    CardNetworkComponent,
    CardSistemasComponent,
    CardLicenciamientosComponent,
    SoftwareComponent,
    TokensAgenciasComponent,
    ModalSoftwareComponent,
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
    UIModule
  ]
})
export class UcoipModule { }
