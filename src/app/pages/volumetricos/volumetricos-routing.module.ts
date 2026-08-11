import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisorReporteVolumenesComponent } from './visor-reporte-volumenes/visor-reporte-volumenes.component';
import { CargaVolumenesComponent } from './carga-volumenes/carga-volumenes.component';
import { ReporteVolumenesComponent } from './reporte-volumenes/reporte-volumenes.component';
import { ParserVolumetricosComponent } from './parser-volumetricos/parser-volumetricos.component';

// const routes: Routes = [];

const routes: Routes = [
  { path: '', component: ReporteVolumenesComponent },
  { path: 'carga-reporte', component: CargaVolumenesComponent },
  { path: 'genera-reporte', component: ParserVolumetricosComponent},
  // { path: 'almacen', component: AlmacenComponent },
  // { path: 'cat-unidades-medidas', component: CatUnidadesMedidasComponent },
  // { path: 'cat-unidades', component: CatUnidadesComponent },
  // { path: 'compras-macro', component: ComprasMacroComponent },
  // { path: 'reporte-gasto-mensual', component: ReporteGastoMensualComponent}
  // { path: 'detalles-solicitud-compra', component: DetallesSolicitudCompraComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolumetricosRoutingModule { }
