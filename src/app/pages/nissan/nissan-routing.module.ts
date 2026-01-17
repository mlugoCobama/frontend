import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosUnidadesComponent } from './pedidos-unidades/pedidos-unidades.component';
import { ComprasSeminuevosComponent } from './compras-seminuevos/compras-seminuevos.component';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { VendedoresComponent } from './comisiones/vendedores/vendedores.component';
import { TabuladorComponent } from './comisiones/tabulador/tabulador.component';


const routes: Routes = [
  { path: 'pedido-unidades', component: PedidosUnidadesComponent },
  { path: 'compra-seminuevos', component: ComprasSeminuevosComponent },
  { path: 'comisiones', component:  ComisionesComponent},
  { path: 'vendedores', component:  VendedoresComponent},
  { path: 'tabulador', component:  TabuladorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NissanRoutingModule { }
