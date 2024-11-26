import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NissanRoutingModule } from './nissan-routing.module';
import { PedidosUnidadesComponent } from './pedidos-unidades/pedidos-unidades.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { ComprasSeminuevosComponent } from './compras-seminuevos/compras-seminuevos.component';


@NgModule({
  declarations: [
    PedidosUnidadesComponent,
    ComprasSeminuevosComponent
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
  ]
})
export class NissanModule { }
