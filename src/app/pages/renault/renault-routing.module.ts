import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SabanaControlComponent } from './sabana-control/sabana-control.component';
import { VisorCitasComponent } from './visor-citas/visor-citas.component';
import { ComisionesComponent } from '../nissan/comisiones/comisiones.component';
import { VendedoresComponent } from '../nissan/comisiones/vendedores/vendedores.component';
import { TabuladorComponent } from '../nissan/comisiones/tabulador/tabulador.component';



const routes: Routes = [
  { path: 'sabana-control', component: SabanaControlComponent },
  { path: 'visor-citas/:id', component: VisorCitasComponent },
  { path: 'comisiones', component:  ComisionesComponent},
  { path: 'vendedores', component:  VendedoresComponent},
  { path: 'tabulador', component:  TabuladorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenaultRoutingModule { }
