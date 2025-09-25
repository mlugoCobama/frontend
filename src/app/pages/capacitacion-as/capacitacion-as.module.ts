import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapacitacionAsRoutingModule } from './capacitacion-as-routing.module';

import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CapacitacionAsComponent } from './capacitacion-as/capacitacion-as.component';
import { VisorVideoComponent } from './visor-video/visor-video.component';
import { NavVerticalComponent } from './nav-vertical/nav-vertical.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { CatPuestosComponent } from './cat-puestos/cat-puestos.component';
import { FormAsignarModulosComponent } from './forms/form-asignar-modulos/form-asignar-modulos.component';
import { ModalPuestoComponent } from './cat-puestos/modal-puesto/modal-puesto.component';
import { ModalAsignaPuestoComponent } from './administracion/modal-asigna-puesto/modal-asigna-puesto.component';
import { VerPermisosPuestoComponent } from './cat-puestos/ver-permisos-puesto/ver-permisos-puesto.component';
import { ModalUpdtPuestoComponent } from './cat-puestos/modal-updt-puesto/modal-updt-puesto.component';

@NgModule({
  declarations: [
    CapacitacionAsComponent,
    VisorVideoComponent,
    NavVerticalComponent,
    AdministracionComponent,
    CatPuestosComponent,
    FormAsignarModulosComponent,
    ModalPuestoComponent,
    ModalAsignaPuestoComponent,
    VerPermisosPuestoComponent,
    ModalUpdtPuestoComponent,
  ],
  imports: [
    CommonModule,
    CapacitacionAsRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask()
  ]
})
export class CapacitacionAsModule { }
