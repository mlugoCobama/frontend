import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergeticosComponent } from './energeticos/energeticos.component';
import { GasolineriasComponent } from './gasolinerias/gasolinerias.component';
import { DetalleEnergeticosComponent } from './energeticos/detalle-energeticos/detalle-energeticos.component';
import { DetalleGasolineriasComponent } from './gasolinerias/detalle-gasolinerias/detalle-gasolinerias.component';
const routes: Routes = [
  { path: 'energeticos', component: EnergeticosComponent },
  { path: 'gasolinerias', component: GasolineriasComponent },
  { path: 'energeticos-detalle/:concepto', component: DetalleEnergeticosComponent },
  { path: 'gasolinerias-detalle/:concepto', component: DetalleGasolineriasComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPagesRoutingModule { }
