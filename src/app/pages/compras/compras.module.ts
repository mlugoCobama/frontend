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
import { DatosSolicitudCompraComponent } from './detalles-solicitud-compra/datos-solicitud-compra/datos-solicitud-compra.component';
import { TablaDetallesSolicitudComponent } from './detalles-solicitud-compra/tabla-detalles-solicitud/tabla-detalles-solicitud.component';
import { ModalAddProveedorComponent } from './proveedores/modal-add-proveedor/modal-add-proveedor.component';
import { ModalUpdtProveedorComponent } from './proveedores/modal-updt-proveedor/modal-updt-proveedor.component';
import { ModalShowProveedorComponent } from './proveedores/modal-show-proveedor/modal-show-proveedor.component';
import { ModalAddUnidadComponent } from './cat-unidades-medidas/modal-add-unidad/modal-add-unidad.component';
import { ModalUpdtUnidadComponent } from './cat-unidades-medidas/modal-updt-unidad/modal-updt-unidad.component';
import { FormCotizacionComponent } from './detalles-solicitud-compra/form-cotizacion/form-cotizacion.component';
import { TblFlsCotizacionComponent } from './detalles-solicitud-compra/tbl-fls-cotizacion/tbl-fls-cotizacion.component';
import { FormFacturasComponent } from './detalles-solicitud-compra/form-facturas/form-facturas.component';
import { DetalleSolicitudesComprasComponent } from './compras/detalle-solicitudes-compras/detalle-solicitudes-compras.component';
import { InfoSolicitudComponent } from './compras/detalle-solicitudes-compras/info-solicitud/info-solicitud.component';
import { TableDetallesSolicitudComponent } from './compras/detalle-solicitudes-compras/table-detalles-solicitud/table-detalles-solicitud.component';
import { PanelCotizacionesComponent } from './compras/detalle-solicitudes-compras/panel-cotizaciones/panel-cotizaciones.component';
import { TableFilesCotizacionesComponent } from './compras/detalle-solicitudes-compras/table-files-cotizaciones/table-files-cotizaciones.component';
import { BtnsAutorizacionComponent } from './compras/detalle-solicitudes-compras/btns-autorizacion/btns-autorizacion.component';
import { FormFilesFacturasComponent } from './compras/detalle-solicitudes-compras/form-files-facturas/form-files-facturas.component';
import { DatosFacturasComponent } from './compras/detalle-solicitudes-compras/datos-facturas/datos-facturas.component';


@NgModule({
  declarations: [
    ComprasComponent,
    CatUnidadesMedidasComponent,
    ProveedoresComponent,
    ModalComprasComponent,
    DetallesSolicitudCompraComponent,
    DatosSolicitudCompraComponent,
    TablaDetallesSolicitudComponent,
    ModalAddProveedorComponent,
    ModalUpdtProveedorComponent,
    ModalShowProveedorComponent,
    ModalAddUnidadComponent,
    ModalUpdtUnidadComponent,
    FormCotizacionComponent,
    TblFlsCotizacionComponent,
    FormFacturasComponent,
    DetalleSolicitudesComprasComponent,
    InfoSolicitudComponent,
    TableDetallesSolicitudComponent,
    PanelCotizacionesComponent,
    TableFilesCotizacionesComponent,
    BtnsAutorizacionComponent,
    FormFilesFacturasComponent,
    DatosFacturasComponent,
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
