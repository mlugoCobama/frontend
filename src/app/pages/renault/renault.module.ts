import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenaultRoutingModule } from './renault-routing.module';
import { SabanaControlComponent } from './sabana-control/sabana-control.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { VisorCitasComponent } from './visor-citas/visor-citas.component';
import { ModalSabanaControlComponent } from './sabana-control/modal-sabana-control/modal-sabana-control.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { OrdenesServicioComponent } from './ordenes-servicio/ordenes-servicio.component';
import { DetalleOrdenComponent } from './ordenes-servicio/detalle-orden/detalle-orden.component';
import { FiltroOrdenesServicioComponent } from './ordenes-servicio/filtro-ordenes-servicio/filtro-ordenes-servicio.component';
import { ComisionesFinanciamientoComponent } from './comisiones-financiamiento/comisiones-financiamiento.component';
import { FinanciamientoFormComponent } from './comisiones-financiamiento/forms/financiamiento-form/financiamiento-form.component';
import { FinanciamientoModalComponent } from './comisiones-financiamiento/financiamiento-modal/financiamiento-modal.component';
import { ComisionesConcentradoComponent } from './comisiones-concentrado/comisiones-concentrado.component';

@NgModule({
  declarations: [
    SabanaControlComponent,
    VisorCitasComponent,
    ModalSabanaControlComponent,
    OrdenesServicioComponent,
    DetalleOrdenComponent,
    FiltroOrdenesServicioComponent,
    ComisionesFinanciamientoComponent,
    FinanciamientoFormComponent,
    FinanciamientoModalComponent,
    ComisionesConcentradoComponent,
  ],
  imports: [
    CommonModule,
    RenaultRoutingModule,
    UIModule,
    ModalModule.forRoot(),
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
export class RenaultModule { }
