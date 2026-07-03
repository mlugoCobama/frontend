import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UcoipComponent } from './ucoip/ucoip.component';
import { InventarioComponent } from './inventario/inventario.component';
import { PermisosComponent } from './permisos/permisos.component';
import { SoftwareComponent } from './software/software.component';
import { TokensAgenciasComponent } from './tokens-agencias/tokens-agencias.component';

const routes: Routes = [
  { path: '', component: UcoipComponent },
  { path: 'ucoip', loadChildren: () => import('./configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
  { path: 'servicios', loadChildren: () => import('./gestion-servicios/gestion-servicios.module').then(m => m.GestionServiciosModule) },
  { path: 'inventario', component: InventarioComponent },
  { path: 'software', component: SoftwareComponent },
  { path: 'tokens', component: TokensAgenciasComponent },
  { path: 'asignacion/permisos', component: PermisosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UcoipRoutingModule { }
