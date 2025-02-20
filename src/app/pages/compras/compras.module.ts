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
import { ModalAddProveedorComponent } from './proveedores/modal-add-proveedor/modal-add-proveedor.component';
import { ModalUpdtProveedorComponent } from './proveedores/modal-updt-proveedor/modal-updt-proveedor.component';
import { ModalShowProveedorComponent } from './proveedores/modal-show-proveedor/modal-show-proveedor.component';
import { ModalAddUnidadComponent } from './cat-unidades-medidas/modal-add-unidad/modal-add-unidad.component';
import { ModalUpdtUnidadComponent } from './cat-unidades-medidas/modal-updt-unidad/modal-updt-unidad.component';
import { FormDetalleScComponent } from './compras/modal-compras/form-detalle-sc/form-detalle-sc.component';





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
    ModalAddProveedorComponent,
    ModalUpdtProveedorComponent,
    ModalShowProveedorComponent,
    ModalAddUnidadComponent,
    ModalUpdtUnidadComponent,
    FormDetalleScComponent,
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
