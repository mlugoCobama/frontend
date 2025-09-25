import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MacroRoutingModule } from './macro-routing.module';

import { DataTablesModule } from 'angular-datatables';

import { ModalModule } from 'ngx-bootstrap/modal';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { MacroComponent } from './macro/macro.component';
import { FormTecnicoComponent } from './forms/form-tecnico/form-tecnico.component';
import { FormEntradaAlmacenComponent } from './forms/form-entrada-almacen/form-entrada-almacen.component';
import { ModalEntradaAlmacenComponent } from './almacen/modal-entrada-almacen/modal-entrada-almacen.component';
import { FormTableEntradasComponent } from './forms/form-table-entradas/form-table-entradas.component';
import { ModalSalidasMacroComponent } from './almacen/modal-salidas-macro/modal-salidas-macro.component';
import { FormSalidasAlmacenComponent } from './forms/form-salidas-almacen/form-salidas-almacen.component';
import { FormTableSalidasComponent } from './forms/form-table-salidas/form-table-salidas.component';

@NgModule({
  declarations: [
    TecnicosComponent,
    AlmacenComponent,
    MacroComponent,
    FormTecnicoComponent,
    FormEntradaAlmacenComponent,
    ModalEntradaAlmacenComponent,
    FormTableEntradasComponent,
    ModalSalidasMacroComponent,
    FormSalidasAlmacenComponent,
    FormTableSalidasComponent,
  ],
  imports: [
    CommonModule,
    MacroRoutingModule,
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
export class MacroModule { }
