import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VolumetricosRoutingModule } from './volumetricos-routing.module';
import { CargaVolumenesComponent } from './carga-volumenes/carga-volumenes.component';
import { VisorReporteVolumenesComponent } from './visor-reporte-volumenes/visor-reporte-volumenes.component';
import { HeaderPlantaComponent } from './widgets/header-planta/header-planta.component';
import { KpiCardComponent } from './widgets/kpi-card/kpi-card.component';
import { InfraestructuraCardComponent } from './widgets/infraestructura-card/infraestructura-card.component';
import { IdentificationCardComponent } from './widgets/identification-card/identification-card.component';
import { TabsResumenesComponent } from './widgets/tabs-resumenes/tabs-resumenes.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablaMovimientosComponent } from './widgets/tabla-movimientos/tabla-movimientos.component';
import { DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReporteVolumenesComponent } from './reporte-volumenes/reporte-volumenes.component';
import { ParserVolumetricosComponent } from './parser-volumetricos/parser-volumetricos.component';
import { CardAclaracionesComponent } from './widgets/card-aclaraciones/card-aclaraciones.component';
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
  declarations: [
    CargaVolumenesComponent,
    VisorReporteVolumenesComponent,
    HeaderPlantaComponent,
    KpiCardComponent,
    InfraestructuraCardComponent,
    IdentificationCardComponent,
    TabsResumenesComponent,
    TablaMovimientosComponent,
    ReporteVolumenesComponent,
    ParserVolumetricosComponent,
    CardAclaracionesComponent
  ],
  imports: [
    CommonModule,
    VolumetricosRoutingModule,
    DataTablesModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    ScrollingModule,
    A11yModule
],
  providers: [
    DecimalPipe,
    DatePipe,
    CurrencyPipe
  ]
})
export class VolumetricosModule { }
