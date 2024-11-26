import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UcoipComponent } from './ucoip/ucoip.component';

const routes: Routes = [
  { path: '', component: UcoipComponent },
  { path: 'ucoip', loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UcoipRoutingModule { }
