import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

import { CapturaMensualRoutingModule } from './captura-mensual-routing.module';
import { CapturaGaserasComponent } from './captura-gaseras/captura-gaseras.component';
import { CapturaGasolineriasComponent } from './captura-gasolinerias/captura-gasolinerias.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CapturaGaserasComponent,
    CapturaGasolineriasComponent
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
