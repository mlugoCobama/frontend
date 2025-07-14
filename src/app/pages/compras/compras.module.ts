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
import { ModalAddProveedorComponent } from './proveedores/modal-add-proveedor/modal-add-proveedor.component';
import { ModalUpdtProveedorComponent } from './proveedores/modal-updt-proveedor/modal-updt-proveedor.component';
import { ModalShowProveedorComponent } from './proveedores/modal-show-proveedor/modal-show-proveedor.component';
import { ModalAddUnidadComponent } from './cat-unidades-medidas/modal-add-unidad/modal-add-unidad.component';
import { ModalUpdtUnidadComponent } from './cat-unidades-medidas/modal-updt-unidad/modal-updt-unidad.component';
import { DetalleSolicitudesComprasComponent } from './compras/detalle-solicitudes-compras/detalle-solicitudes-compras.component';
import { InfoSolicitudComponent } from './compras/detalle-solicitudes-compras/info-solicitud/info-solicitud.component';
import { TableDetallesSolicitudComponent } from './compras/detalle-solicitudes-compras/table-detalles-solicitud/table-detalles-solicitud.component';
import { PanelCotizacionesComponent } from './compras/detalle-solicitudes-compras/panel-cotizaciones/panel-cotizaciones.component';
import { TableFilesCotizacionesComponent } from './compras/detalle-solicitudes-compras/table-files-cotizaciones/table-files-cotizaciones.component';
import { BtnsAutorizacionComponent } from './compras/detalle-solicitudes-compras/btns-autorizacion/btns-autorizacion.component';
import { FormFilesFacturasComponent } from './compras/detalle-solicitudes-compras/form-files-facturas/form-files-facturas.component';
import { DatosFacturasComponent } from './compras/detalle-solicitudes-compras/datos-facturas/datos-facturas.component';
import { BtnAutorizacionGerenciaComponent } from './compras/detalle-solicitudes-compras/btn-autorizacion-gerencia/btn-autorizacion-gerencia.component';
import { CatUnidadesComponent } from './cat-unidades/cat-unidades.component';
import { ComprasMacroComponent } from './compras-macro/compras-macro.component';
import { ModalComprasMacroComponent } from './compras-macro/modal-compras-macro/modal-compras-macro.component';
import { FormSolicitudMacroComponent } from './forms-solicitud/form-solicitud-macro/form-solicitud-macro.component';
import { FormDetalleSolicitudComponent } from './forms-solicitud/form-detalle-solicitud/form-detalle-solicitud.component';
import { FormSolicitudComponent } from './forms-solicitud/form-solicitud/form-solicitud.component';
import { FormActualizarDetalleComponent } from './forms-solicitud/form-actualizar-detalle/form-actualizar-detalle.component';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TablaDetallesSolicitudComponent } from './compras/detalle-solicitudes-compras/tabla-detalles-solicitud/tabla-detalles-solicitud.component';
import { BontonesGeneralesComponent } from './botonera/bontones-generales/bontones-generales.component';
import { BotnesAdminComponent } from './botonera/botnes-admin/botnes-admin.component';

@NgModule({
  declarations: [
    ComprasComponent,
    CatUnidadesMedidasComponent,
    ProveedoresComponent,
    ModalComprasComponent,
    ModalAddProveedorComponent,
    ModalUpdtProveedorComponent,
    ModalShowProveedorComponent,
    ModalAddUnidadComponent,
    ModalUpdtUnidadComponent,
    DetalleSolicitudesComprasComponent,
    InfoSolicitudComponent,
    TableDetallesSolicitudComponent,
    PanelCotizacionesComponent,
    TableFilesCotizacionesComponent,
    BtnsAutorizacionComponent,
    FormFilesFacturasComponent,
    DatosFacturasComponent,
    BtnAutorizacionGerenciaComponent,
    CatUnidadesComponent,
    ComprasMacroComponent,
    ModalComprasMacroComponent,
    FormSolicitudMacroComponent,
    FormDetalleSolicitudComponent,
    FormSolicitudComponent,
    FormActualizarDetalleComponent,
    TablaDetallesSolicitudComponent,
    BontonesGeneralesComponent,
    BotnesAdminComponent,
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
    NgxMaskDirective,
    NgxMaskPipe,

  ],
  providers: [
    provideNgxMask()
  ]
})
export class ComprasModule { }
