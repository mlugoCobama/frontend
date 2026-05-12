import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionServiciosRoutingModule } from './gestion-servicios-routing.module';
import { DashboardServiciosComponent } from './dashboard-servicios/dashboard-servicios.component';
import { CatServiciosComponent } from './cat-servicios/cat-servicios.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { AsignacionServiciosComponent } from './asignacion-servicios/asignacion-servicios.component';
import { FormServicioEmpresaComponent } from './asignacion-servicios/forms/form-servicio-empresa/form-servicio-empresa.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ModalAsignacionServicioComponent } from './asignacion-servicios/modal-asignacion-servicio/modal-asignacion-servicio.component';


@NgModule({
  declarations: [
    DashboardServiciosComponent,
    CatServiciosComponent,
    AsignacionServiciosComponent,
    FormServicioEmpresaComponent,
    ModalAsignacionServicioComponent
  ],
  imports: [
    UIModule,
    CommonModule,
    GestionServiciosRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
     ],
    providers: [
      provideNgxMask()
    ]
})
export class GestionServiciosModule { }
