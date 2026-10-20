import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlAsistenciaRoutingModule } from './control-asistencia-routing.module';
import { EmpleadosComponent } from './empleados/empleados.component';
import { BiometricosComponent } from './biometricos/biometricos.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalEmpleadosComponent } from './empleados/modal-empleados/modal-empleados.component';
import { ModalReporteComponent } from './asistencia/modal-reporte/modal-reporte.component';


@NgModule({
  declarations: [
    EmpleadosComponent,
    BiometricosComponent,
    AsistenciaComponent,
    ModalEmpleadosComponent,
    ModalReporteComponent
  ],
  imports: [
    CommonModule,
    ControlAsistenciaRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ControlAsistenciaModule { }
