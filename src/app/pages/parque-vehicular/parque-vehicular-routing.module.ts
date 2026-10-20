import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosVehiculosComponent } from './servicios-vehiculos/servicios-vehiculos.component';
import { ParqueVehicularComponent } from './parque-vehicular/parque-vehicular.component';

const routes: Routes = [
  { path: '', component: ParqueVehicularComponent },
  { path: 'ordenes-servicio', component: ServiciosVehiculosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ParqueVehicularRoutingModule { }
