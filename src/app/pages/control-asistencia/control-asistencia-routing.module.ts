import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { BiometricosComponent } from './biometricos/biometricos.component';
import { EmpleadosComponent } from './empleados/empleados.component';

const routes: Routes = [
  { path: 'asistencia', component: AsistenciaComponent },
  { path: 'biometricos', component: BiometricosComponent },
  { path: 'empleados', component: EmpleadosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlAsistenciaRoutingModule { }
