import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizzardTarjetasDeClientesComponent } from './wizzard-tarjetas-de-clientes/wizzard-tarjetas-de-clientes.component';
import { TarjetasCleintesListComponent } from './tarjetas-cleintes-list/tarjetas-cleintes-list.component';

const routes: Routes = [

    { path: '', component: WizzardTarjetasDeClientesComponent },
    { path: 'listado', component: TarjetasCleintesListComponent },
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarjetaDeClientesRoutingModule { }
