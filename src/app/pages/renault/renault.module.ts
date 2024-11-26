import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenaultRoutingModule } from './renault-routing.module';
import { SabanaControlComponent } from './sabana-control/sabana-control.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { VisorCitasComponent } from './visor-citas/visor-citas.component';
import { ModalSabanaControlComponent } from './sabana-control/modal-sabana-control/modal-sabana-control.component';
import { ModalModule } from 'ngx-bootstrap/modal';


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
  ]
})
export class RenaultModule { }
