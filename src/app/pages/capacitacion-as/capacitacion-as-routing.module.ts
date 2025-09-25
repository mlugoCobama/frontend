import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CapacitacionAsComponent } from './capacitacion-as/capacitacion-as.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { CatPuestosComponent } from './cat-puestos/cat-puestos.component';

const routes: Routes = [
  { path: '', component: CapacitacionAsComponent },
  { path: 'admin-capacitacion', component: AdministracionComponent },
  { path: 'catalogo-puestos', component: CatPuestosComponent },
  { path: 'ver/:modulo/:submodulo', component: CapacitacionAsComponent  },

];

@NgModule({
  // imports: [RouterModule.forChild(routes)],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],

  exports: [RouterModule]
})
export class CapacitacionAsRoutingModule { }
