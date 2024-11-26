import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulosComponent } from './modulos/modulos.component';
import { PermisosComponent } from './permisos/permisos.component';

const routes: Routes = [
  { path: 'configuracion/modulos', component: ModulosComponent },
  { path: 'configuracion/permisos', component: PermisosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
