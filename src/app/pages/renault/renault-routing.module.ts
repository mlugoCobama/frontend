import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SabanaControlComponent } from './sabana-control/sabana-control.component';
import { VisorCitasComponent } from './visor-citas/visor-citas.component';
import { ComisionesComponent } from '../nissan/comisiones/comisiones.component';
import { VendedoresComponent } from '../nissan/comisiones/vendedores/vendedores.component';
import { TabuladorComponent } from '../nissan/comisiones/tabulador/tabulador.component';
import { OrdenesServicioComponent } from './ordenes-servicio/ordenes-servicio.component';
import { DetalleOrdenComponent } from './ordenes-servicio/detalle-orden/detalle-orden.component';
import { ComisionesFinanciamientoComponent } from './comisiones-financiamiento/comisiones-financiamiento.component';
import { ComisionesConcentradoComponent } from './comisiones-concentrado/comisiones-concentrado.component';



const routes: Routes = [
  { path: 'sabana-control', component: SabanaControlComponent },
  { path: 'visor-citas/:id', component: VisorCitasComponent },
  { path: 'comisiones', component:  ComisionesComponent},
  { path: 'comisiones/nrfinance', component:  ComisionesFinanciamientoComponent},
  { path: 'comisiones/concentrado', component:  ComisionesConcentradoComponent},
  { path: 'vendedores', component:  VendedoresComponent},
  { path: 'tabulador', component:  TabuladorComponent},
  { path: 'ordenes-servicio', component:  OrdenesServicioComponent},
  { path: 'orden-servicio/:folio/:id', component: DetalleOrdenComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenaultRoutingModule { }
