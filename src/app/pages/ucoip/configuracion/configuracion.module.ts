import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { PermisosComponent } from './permisos/permisos.component';
import { ModulosComponent } from './modulos/modulos.component';


@NgModule({
  declarations: [
    PermisosComponent,
    ModulosComponent
  ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule
  ]
})
export class ConfiguracionModule { }
