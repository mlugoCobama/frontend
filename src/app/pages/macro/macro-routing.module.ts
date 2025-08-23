import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MacroComponent } from './macro/macro.component';
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { AlmacenComponent } from './almacen/almacen.component';

const routes: Routes = [
  { path: '', component: MacroComponent },
  { path: 'tecnicos', component: TecnicosComponent },
  { path: 'almacen', component: AlmacenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MacroRoutingModule { }
