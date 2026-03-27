import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NissanRoutingModule } from './nissan-routing.module';
import { PedidosUnidadesComponent } from './pedidos-unidades/pedidos-unidades.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ComprasSeminuevosComponent } from './compras-seminuevos/compras-seminuevos.component';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { TablaCapturaComponent } from './comisiones/tabla-captura/tabla-captura.component';
import { TablaPagadasComponent } from './comisiones/tabla-pagadas/tabla-pagadas.component';
import { VendedoresComponent } from './comisiones/vendedores/vendedores.component';
import { TabuladorComponent } from './comisiones/tabulador/tabulador.component';
import { FiltroComponent } from './comisiones/filtro/filtro.component';
import { BotoneraComponent } from './comisiones/botonera/botonera.component';
import { SpinerComponent } from './comisiones/spiner/spiner.component';
// import { CardTopComponent } from './comisiones/card-top/card-top.component';
import { ModalAddVendedorComponent } from './comisiones/vendedores/modal-add-vendedor/modal-add-vendedor.component';
import { FormVendedoresComponent } from './comisiones/vendedores/form-vendedores/form-vendedores.component';
import { ModalUpdateVendedorComponent } from './comisiones/vendedores/modal-update-vendedor/modal-update-vendedor.component';
import { FormTabuladorComponent } from './comisiones/tabulador/form-tabulador/form-tabulador.component';
import { ModalAddTabuladorComponent } from './comisiones/tabulador/modal-add-tabulador/modal-add-tabulador.component';
import { ModalUpdateTabuladorComponent } from './comisiones/tabulador/modal-update-tabulador/modal-update-tabulador.component';


@NgModule({
  declarations: [
    PedidosUnidadesComponent,
    ComprasSeminuevosComponent,
    ComisionesComponent,
    TablaCapturaComponent,
    TablaPagadasComponent,
    VendedoresComponent,
    TabuladorComponent,
    FiltroComponent,
    BotoneraComponent,
    SpinerComponent,
    // CardTopComponent,
    ModalAddVendedorComponent,
    FormVendedoresComponent,
    ModalUpdateVendedorComponent,
    FormTabuladorComponent,
    ModalAddTabuladorComponent,
    ModalUpdateTabuladorComponent
  ],
  imports: [
    CommonModule,
    NissanRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    provideNgxMask()
  ]
})
export class NissanModule { }
