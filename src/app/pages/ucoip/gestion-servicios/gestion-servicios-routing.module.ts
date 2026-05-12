import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardServiciosComponent } from './dashboard-servicios/dashboard-servicios.component';
import { CatServiciosComponent } from './cat-servicios/cat-servicios.component';
import { AsignacionServiciosComponent } from './asignacion-servicios/asignacion-servicios.component';

const routes: Routes = [
  { path: '', component: DashboardServiciosComponent },
  { path: 'cat-servicios', component: CatServiciosComponent },
  { path: 'asignacion-servicios', component: AsignacionServiciosComponent },
  { path: 'gestion-servicios/dashboard', component: DashboardServiciosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionServiciosRoutingModule { }
