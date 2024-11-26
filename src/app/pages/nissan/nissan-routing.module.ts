import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosUnidadesComponent } from './pedidos-unidades/pedidos-unidades.component';
import { ComprasSeminuevosComponent } from './compras-seminuevos/compras-seminuevos.component';

const routes: Routes = [
  { path: 'pedido-unidades', component: PedidosUnidadesComponent },
  { path: 'compra-seminuevos', component: ComprasSeminuevosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NissanRoutingModule { }
