import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ChartModule } from 'angular-highcharts';

import { LandingPagesRoutingModule } from './landing-pages-routing.module';
import { EnergeticosComponent } from './energeticos/energeticos.component';
import { TotalesComponent } from './energeticos/widgets/totales/totales.component';
import { TotalesGraficaComponent } from './energeticos/widgets/totales-grafica/totales-grafica.component';
import { DetalleEnergeticosComponent } from './energeticos/detalle-energeticos/detalle-energeticos.component';
import { AnualComponent } from './energeticos/widgets/anual/anual.component';
import { TablaComponent } from './energeticos/widgets/tabla/tabla.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    EnergeticosComponent,
    TotalesComponent,
    TotalesGraficaComponent,
    DetalleEnergeticosComponent,
    AnualComponent,
    TablaComponent,
  ],
  imports: [
    CommonModule,
    LandingPagesRoutingModule,
    ChartModule,
    DataTablesModule
  ],
  providers: [
    DatePipe
  ]
})
export class LandingPagesModule { }
