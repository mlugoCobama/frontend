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
import { ComisionesTomaUnidadesComponent } from './comisiones-toma-unidades/comisiones-toma-unidades.component';
import { TomaUnidadesModalComponent } from './comisiones-toma-unidades/toma-unidades-modal/toma-unidades-modal.component';
import { TomaUnidadFormComponent } from './comisiones-toma-unidades/forms/toma-unidad-form/toma-unidad-form.component';
import { ComsionesSeguroComponent } from './comsiones-seguro/comsiones-seguro.component';
import { SeguroModalComponent } from './comsiones-seguro/seguro-modal/seguro-modal.component';
import { SeguroFormComponent } from './comsiones-seguro/forms/seguro-form/seguro-form.component';
import { ComisionesAccesoriosComponent } from './comisiones-accesorios/comisiones-accesorios.component';
import { AccesorioFormComponent } from './comisiones-accesorios/forms/accesorio-form/accesorio-form.component';
import { DetalleAccesorioFormComponent } from './comisiones-accesorios/forms/detalle-accesorio-form/detalle-accesorio-form.component';
import { AccesorioModalComponent } from './comisiones-accesorios/accesorio-modal/accesorio-modal.component';
import { ModalDetalleRubroComponent } from './comisiones-concentrado/modal-detalle-rubro/modal-detalle-rubro.component';
import { TablaConcentradoComisionesComponent } from './comisiones-concentrado/tabla-concentrado-comisiones/tabla-concentrado-comisiones.component';
import { VisorCortesComponent } from './visor-cortes/visor-cortes.component';

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
    ComisionesTomaUnidadesComponent,
    TomaUnidadesModalComponent,
    TomaUnidadFormComponent,
    ComsionesSeguroComponent,
    SeguroModalComponent,
    SeguroFormComponent,
    ComisionesAccesoriosComponent,
    AccesorioFormComponent,
    DetalleAccesorioFormComponent,
    AccesorioModalComponent,
    ModalDetalleRubroComponent,
    TablaConcentradoComisionesComponent,
    VisorCortesComponent,
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
