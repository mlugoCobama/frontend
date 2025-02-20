import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergeticosComponent } from './energeticos/energeticos.component';
import { DetalleEnergeticosComponent } from './energeticos/detalle-energeticos/detalle-energeticos.component';

const routes: Routes = [
  { path: 'energeticos', component: EnergeticosComponent },
  { path: 'energeticos-detalle/:concepto', component: DetalleEnergeticosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPagesRoutingModule { }
