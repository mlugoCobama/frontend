import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras/compras.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CatUnidadesMedidasComponent } from './cat-unidades-medidas/cat-unidades-medidas.component';
import { CatUnidadesComponent } from './cat-unidades/cat-unidades.component';
import { ComprasMacroComponent } from './compras-macro/compras-macro.component';
import { ReporteGastoMensualComponent } from './reportes-compras/reporte-gasto-mensual/reporte-gasto-mensual.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CatTarjetasTokaComponent } from './cat-tarjetas-toka/cat-tarjetas-toka.component';
import { DispersionesComponent } from './dispersiones/dispersiones.component';
// import { DetallesSolicitudCompraComponent } from './detalles-solicitud-compra/detalles-solicitud-compra.component';

const routes: Routes = [
  { path: '', component: ComprasComponent },
  { path: 'proveedores', component: ProveedoresComponent},
  { path: 'almacen', component: AlmacenComponent },
  { path: 'cat-unidades-medidas', component: CatUnidadesMedidasComponent },
  { path: 'cat-unidades', component: CatUnidadesComponent },
  { path: 'compras-macro', component: ComprasMacroComponent },
  { path: 'cat-tarjetas-toka', component: CatTarjetasTokaComponent },
  {path:'dispersiones', component: DispersionesComponent},
  { path: 'reporte-gasto-mensual', component: ReporteGastoMensualComponent}
  // { path: 'detalles-solicitud-compra', component: DetallesSolicitudCompraComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
