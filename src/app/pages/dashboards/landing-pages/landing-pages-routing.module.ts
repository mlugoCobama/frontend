import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergeticosComponent } from './energeticos/energeticos.component';
import { GasolineriasComponent } from './gasolinerias/gasolinerias.component';
import { DetalleEnergeticosComponent } from './energeticos/detalle-energeticos/detalle-energeticos.component';
import { DetalleGasolineriasComponent } from './gasolinerias/detalle-gasolinerias/detalle-gasolinerias.component';
import { NissanComponent } from './nissan/nissan.component';
import { RenaultComponent } from './renault/renault.component';
import { DetalleNissanComponent } from './nissan/detalle-nissan/detalle-nissan.component';
import { DetalleReanultComponent } from './renault/detalle-reanult/detalle-reanult.component';

import { DetalleAntInventarioComponent } from './nissan/widgets/detalle-ant-inventario/detalle-ant-inventario.component';

const routes: Routes = [
  { path: 'energeticos', component: EnergeticosComponent },
  { path: 'gasolinerias', component: GasolineriasComponent },
  { path: 'nissan', component: NissanComponent },
  { path: 'reanult', component: RenaultComponent },
  { path: 'energeticos-detalle/:concepto', component: DetalleEnergeticosComponent },
  { path: 'gasolinerias-detalle/:concepto', component: DetalleGasolineriasComponent  },
  { path: 'nissan-detalle/:concepto', component: DetalleNissanComponent  },
  { path: 'renault-detalle/:concepto', component: DetalleReanultComponent  },

  { path: 'nissan-ant-detalle/:concepto', component:  DetalleAntInventarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPagesRoutingModule { }
