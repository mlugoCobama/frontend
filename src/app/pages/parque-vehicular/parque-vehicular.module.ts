import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParqueVehicularRoutingModule } from './parque-vehicular-routing.module';
import { ServiciosVehiculosComponent } from './servicios-vehiculos/servicios-vehiculos.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ParqueVehicularComponent } from './parque-vehicular/parque-vehicular.component';
import { ModalAsignacionVehiculosComponent } from './servicios-vehiculos/modal-asignacion-vehiculos/modal-asignacion-vehiculos.component';
import { FiltroComponent } from './servicios-vehiculos/filtro/filtro.component';
import { KanbanComponent } from './servicios-vehiculos/kanban/kanban.component';
import { DetalleOrdenServicioComponent } from './servicios-vehiculos/detalle-orden-servicio/detalle-orden-servicio.component';
import { ProveedorSelectorComponent } from './servicios-vehiculos/detalle-orden-servicio/proveedor-selector/proveedor-selector.component';
import { MediaGalleryComponent } from './servicios-vehiculos/media-gallery/media-gallery.component';
import { DiagnosticoVehiculoComponent } from './servicios-vehiculos/detalle-orden-servicio/diagnostico-vehiculo/diagnostico-vehiculo.component';
import { BtnAutorizacionComponent } from './servicios-vehiculos/detalle-orden-servicio/btn-autorizacion/btn-autorizacion.component';
import { TimeLineCitaComponent } from './servicios-vehiculos/detalle-orden-servicio/time-line-cita/time-line-cita.component';


@NgModule({
  declarations: [
    ServiciosVehiculosComponent,
    ParqueVehicularComponent,
    ModalAsignacionVehiculosComponent,
    FiltroComponent,
    KanbanComponent,
    DetalleOrdenServicioComponent,
    ProveedorSelectorComponent,
    MediaGalleryComponent,
    DiagnosticoVehiculoComponent,
    BtnAutorizacionComponent,
    TimeLineCitaComponent

  ],
  imports: [
    CommonModule,
    ParqueVehicularRoutingModule,
    UIModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CdkStepperModule,
    NgStepperModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ]
})
export class ParqueVehicularModule { }
