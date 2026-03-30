import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardServiciosComponent } from './dashboard-servicios/dashboard-servicios.component';

const routes: Routes = [
  { path: 'gestion-servicios/dashboard', component: DashboardServiciosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionServiciosRoutingModule { }
