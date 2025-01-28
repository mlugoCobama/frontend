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
import { DatosSolicitudCompraComponent } from './detalles-solicitud-compra/datos-solicitud-compra/datos-solicitud-compra.component';
import { TablaDetallesSolicitudComponent } from './detalles-solicitud-compra/tabla-detalles-solicitud/tabla-detalles-solicitud.component';





@NgModule({
  declarations: [
    ComprasComponent,
    CatUnidadesMedidasComponent,
    ProveedoresComponent,
    ModalComprasComponent,
    DetallesSolicitudCompraComponent,
    CotizacionesComponent,
    DatosSolicitudCompraComponent,
    TablaDetallesSolicitudComponent,
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
