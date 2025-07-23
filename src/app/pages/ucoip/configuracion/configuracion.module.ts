import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { PermisosComponent } from './permisos/permisos.component';
import { ModulosComponent } from './modulos/modulos.component';
import { ModalModulosComponent } from './modulos/modal-modulos/modal-modulos.component';
import { ModalPermisosComponent } from './permisos/modal-permisos/modal-permisos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    PermisosComponent,
    ModulosComponent,
    ModalModulosComponent,
    ModalPermisosComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
  ]
})
export class ConfiguracionModule { }
