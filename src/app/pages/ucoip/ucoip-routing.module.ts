import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UcoipComponent } from './ucoip/ucoip.component';
import { InventarioComponent } from './inventario/inventario.component';
import { PermisosComponent } from './permisos/permisos.component';

const routes: Routes = [
  { path: '', component: UcoipComponent },
  { path: 'ucoip', loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
  { path: 'inventario', component: InventarioComponent },
  { path: 'testing/provisional/permisos', component: PermisosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UcoipRoutingModule { }
