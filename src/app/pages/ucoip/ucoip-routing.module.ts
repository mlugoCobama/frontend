import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UcoipComponent } from './ucoip/ucoip.component';
import { InventarioComponent } from './inventario/inventario.component';

const routes: Routes = [
  { path: '', component: UcoipComponent },
  { path: 'ucoip', loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
  { path: 'inventario', component: InventarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UcoipRoutingModule { }
