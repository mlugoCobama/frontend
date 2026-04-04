import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosUnidadesComponent } from './pedidos-unidades/pedidos-unidades.component';
import { ComprasSeminuevosComponent } from './compras-seminuevos/compras-seminuevos.component';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { VendedoresComponent } from './comisiones/vendedores/vendedores.component';
import { TabuladorComponent } from './comisiones/tabulador/tabulador.component';
import { ComisionesFinanciamientoComponent } from '../renault/comisiones-financiamiento/comisiones-financiamiento.component';
import { ComisionesConcentradoComponent } from '../renault/comisiones-concentrado/comisiones-concentrado.component';
import { ComisionesTomaUnidadesComponent } from '../renault/comisiones-toma-unidades/comisiones-toma-unidades.component';
import { ComsionesSeguroComponent } from '../renault/comsiones-seguro/comsiones-seguro.component';
import { ComisionesAccesoriosComponent } from '../renault/comisiones-accesorios/comisiones-accesorios.component';


const routes: Routes = [
  { path: 'pedido-unidades', component: PedidosUnidadesComponent },
  { path: 'compra-seminuevos', component: ComprasSeminuevosComponent },
  // { path: 'comisiones/concentrado', component:  ComisionesComponent},
  { path: 'comisiones/financiamiento', component:  ComisionesFinanciamientoComponent},
  { path: 'comisiones/concentrado', component:  ComisionesConcentradoComponent},
  { path: 'comisiones/nuevos', component:  ComisionesComponent},
  { path: 'comisiones/seminuevos', component:  ComisionesComponent},
  { path: 'comisiones/toma-unidades', component:  ComisionesTomaUnidadesComponent},
  { path: 'comisiones/seguros', component:  ComsionesSeguroComponent},
  { path: 'comisiones/accesorios', component:  ComisionesAccesoriosComponent},
  { path: 'vendedores', component:  VendedoresComponent},
  { path: 'tabulador', component:  TabuladorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NissanRoutingModule { }
