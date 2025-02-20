import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';

const routes: Routes = [
  { path: 'captura', loadChildren: () => import('./captura-mensual/captura-mensual.module').then(m => m.CapturaMensualModule) },
  { path: 'landing-page', loadChildren: () => import('./landing-pages/landing-pages.module').then(m => m.LandingPagesModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
