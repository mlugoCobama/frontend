import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

import { CapturaMensualRoutingModule } from './captura-mensual-routing.module';
import { CapturaGaserasComponent } from './captura-gaseras/captura-gaseras.component';
import { CapturaGasolineriasComponent } from './captura-gasolinerias/captura-gasolinerias.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CapturaAgenciasComponent } from './captura-agencias/captura-agencias.component';
import { FormUVendidasComponent } from './captura-agencias/forms/form-u-vendidas/form-u-vendidas.component';
import { FormTablaCapturaComponent } from './captura-agencias/forms/form-tabla-captura/form-tabla-captura.component';
import { TablaMesAgenciaComponent } from './captura-agencias/forms/tabla-mes-agencia/tabla-mes-agencia.component';


@NgModule({
  declarations: [
    CapturaGaserasComponent,
    CapturaGasolineriasComponent,
    CapturaAgenciasComponent,
    FormUVendidasComponent,
    FormTablaCapturaComponent,
    TablaMesAgenciaComponent
  ],
  imports: [
    CommonModule,
    CapturaMensualRoutingModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxMask()
  ]
})
export class CapturaMensualModule { }
