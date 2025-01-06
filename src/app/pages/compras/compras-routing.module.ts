import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras/compras.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CatUnidadesMedidasComponent } from './cat-unidades-medidas/cat-unidades-medidas.component';
import { DetallesSolicitudCompraComponent } from './detalles-solicitud-compra/detalles-solicitud-compra.component';

const routes: Routes = [
  { path: '', component: ComprasComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'cat-unidades-medidas', component: CatUnidadesMedidasComponent },
  { path: 'detalles-solicitud-compra', component: DetallesSolicitudCompraComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
