import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SabanaControlComponent } from './sabana-control/sabana-control.component';
import { VisorCitasComponent } from './visor-citas/visor-citas.component';

const routes: Routes = [
  { path: 'sabana-control', component: SabanaControlComponent },
  { path: 'visor-citas/:id', component: VisorCitasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenaultRoutingModule { }
