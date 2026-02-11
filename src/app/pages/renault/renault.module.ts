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


@NgModule({
  declarations: [
    SabanaControlComponent,
    VisorCitasComponent,
    ModalSabanaControlComponent
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
