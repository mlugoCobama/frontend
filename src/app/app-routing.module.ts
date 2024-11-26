import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { Page404Component } from './extrapages/page404/page404.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: '', component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), canActivate: [AuthGuard] },
  { path: 'pages',  loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule), canActivate: [AuthGuard] },
  { path: 'ucoip', component: LayoutComponent, loadChildren: () => import('./pages/ucoip/ucoip.module').then(m => m.UcoipModule), canActivate: [AuthGuard] },
  { path: 'dashboard', component: LayoutComponent, loadChildren: () => import('./pages/dashboards/dashboards.module').then(m => m.DashboardsModule), canActivate: [AuthGuard] },
  { path: 'compras', component: LayoutComponent, loadChildren: () => import('./pages/compras/compras.module').then(m => m.ComprasModule), canActivate: [AuthGuard] },
  { path: 'nissan', component: LayoutComponent, loadChildren: () => import('./pages/nissan/nissan.module').then(m => m.NissanModule), canActivate: [AuthGuard] },
  { path: 'renault', component: LayoutComponent, loadChildren: () => import('./pages/renault/renault.module').then(m => m.RenaultModule), canActivate: [AuthGuard] },
  { path: 'crypto-ico-landing', component: CyptolandingComponent },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
