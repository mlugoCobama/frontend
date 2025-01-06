import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras/compras.component';
import { DataTablesModule } from 'angular-datatables';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CatUnidadesMedidasComponent } from './cat-unidades-medidas/cat-unidades-medidas.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalComprasComponent } from './compras/modal-compras/modal-compras.component';
import { DetallesSolicitudCompraComponent } from './detalles-solicitud-compra/detalles-solicitud-compra.component';
import { CotizacionesComponent } from './cotizacion/cotizaciones/cotizaciones.component';




@NgModule({
  declarations: [
    ComprasComponent,
    CatUnidadesMedidasComponent,
    ProveedoresComponent,
    ModalComprasComponent,
    DetallesSolicitudCompraComponent,
    CotizacionesComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),

  ]
})
export class ComprasModule { }
