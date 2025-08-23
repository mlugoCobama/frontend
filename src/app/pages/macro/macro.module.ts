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

@NgModule({
  declarations: [
    TecnicosComponent,
    AlmacenComponent,
    MacroComponent,
    FormTecnicoComponent
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
