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
import { TablaPreciosDetallesComponent } from './forms-solicitud/tabla-precios-detalles/tabla-precios-detalles.component';
import { ModalAddAutotanqueComponent } from './cat-unidades/modal-add-autotanque/modal-add-autotanque.component';
import { FormDatosVehiculoComponent } from './cat-unidades/form-datos-vehiculo/form-datos-vehiculo.component';
import { FormDatosTanqueComponent } from './cat-unidades/form-datos-tanque/form-datos-tanque.component';
import { ModalUpdtAutotanqueComponent } from './cat-unidades/modal-updt-autotanque/modal-updt-autotanque.component';
import { ModalCostosUnidadComponent } from './cat-unidades/modal-costos-unidad/modal-costos-unidad.component';
import { ModalAddComprobanteComponent } from './compras/detalle-solicitudes-compras/datos-facturas/modal-add-comprobante/modal-add-comprobante.component';
import { ModalAddComplementoComponent } from './compras/detalle-solicitudes-compras/datos-facturas/modal-add-complemento/modal-add-complemento.component';
import { FormComplementoComponent } from './compras/detalle-solicitudes-compras/datos-facturas/form-complemento/form-complemento.component';
import { SelectSistemaMantenimientoComponent } from './compras-macro/select-sistema-mantenimiento/select-sistema-mantenimiento.component';
import { DetalleSolicitudMacroComponent } from './compras-macro/detalle-solicitud-macro/detalle-solicitud-macro.component';
import { TimelineSolicitudComponent } from './timeline-solicitud/timeline-solicitud.component';
import { FormDatosPolizaComponent } from './cat-unidades/form-datos-poliza/form-datos-poliza.component';
import { BtnAtorizarAPagoComponent } from './compras/detalle-solicitudes-compras/btn-atorizar-a-pago/btn-atorizar-a-pago.component';
import { PanelEntregasComponent } from './compras/detalle-solicitudes-compras/panel-entregas/panel-entregas.component';
import { ModalSeguimientoComponent } from './compras/modal-seguimiento/modal-seguimiento.component';
import { ModalHistorialComentariosComponent } from './cat-unidades/modal-historial-comentarios/modal-historial-comentarios.component';
import { ModalHistorialPolizasComponent } from './cat-unidades/modal-historial-polizas/modal-historial-polizas.component';
import { FormProveedorContactosComponent } from './proveedores/forms/form-proveedor-contactos/form-proveedor-contactos.component';
import { FormDatosProveedorComponent } from './proveedores/forms/form-datos-proveedor/form-datos-proveedor.component';
import { FormExpedienteProveedorComponent } from './proveedores/forms/form-expediente-proveedor/form-expediente-proveedor.component';
import { ModalPreviewOrdenCompraComponent } from './compras/modal-preview-orden-compra/modal-preview-orden-compra.component';
import { PdfPreviewComponent } from './compras/modal-preview-orden-compra/pdf-preview/pdf-preview.component';
import { TableDetallesSolicitudSegComponent } from './compras/modal-seguimiento/table-detalles-solicitud-seg/table-detalles-solicitud-seg.component';
import { ComprasKanbanComponent } from './compras/compras-kanban/compras-kanban.component';
import { BtnFinalizarCompraComponent } from './compras/detalle-solicitudes-compras/btn-finalizar-compra/btn-finalizar-compra.component';
import { FormDatosEntregaOcComponent } from './compras/detalle-solicitudes-compras/form-datos-entrega-oc/form-datos-entrega-oc.component';
import { ReportesComprasComponent } from './reportes-compras/reportes-compras.component';
import { ReporteGastoMensualComponent } from './reportes-compras/reporte-gasto-mensual/reporte-gasto-mensual.component';
import { FormFiltroMensualComponent } from './reportes-compras/widgets/form-filtro-mensual/form-filtro-mensual.component';
import { TableTotalConcentradoMensualComponent } from './reportes-compras/widgets/table-total-concentrado-mensual/table-total-concentrado-mensual.component';
import { TableTotalDetalleComponent } from './reportes-compras/widgets/table-total-detalle/table-total-detalle.component';
import { ModalDetalleComponent } from './reportes-compras/widgets/modal-detalle/modal-detalle.component';
import { CardSpinerComponent } from './reportes-compras/widgets/card-spiner/card-spiner.component';

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
    TablaPreciosDetallesComponent,
    ModalAddAutotanqueComponent,
    FormDatosVehiculoComponent,
    FormDatosTanqueComponent,
    ModalUpdtAutotanqueComponent,
    ModalCostosUnidadComponent,
    ModalAddComprobanteComponent,
    ModalAddComplementoComponent,
    FormComplementoComponent,
    SelectSistemaMantenimientoComponent,
    DetalleSolicitudMacroComponent,
    TimelineSolicitudComponent,
    FormDatosPolizaComponent,
    BtnAtorizarAPagoComponent,
    PanelEntregasComponent,
    ModalSeguimientoComponent,
    ModalHistorialComentariosComponent,
    ModalHistorialPolizasComponent,
    FormProveedorContactosComponent,
    FormDatosProveedorComponent,
    FormExpedienteProveedorComponent,
    ModalPreviewOrdenCompraComponent,
    PdfPreviewComponent,
    TableDetallesSolicitudSegComponent,
    ComprasKanbanComponent,
    BtnFinalizarCompraComponent,
    FormDatosEntregaOcComponent,
    ReportesComprasComponent,
    ReporteGastoMensualComponent,
    FormFiltroMensualComponent,
    TableTotalConcentradoMensualComponent,
    TableTotalDetalleComponent,
    ModalDetalleComponent,
    CardSpinerComponent,
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
