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
import { HighchartsChartModule } from 'highcharts-angular';
import { GraficaBarraComponent } from './energeticos/widgets/grafica-barra/grafica-barra.component';
import { PorcentajesGraficasComponent } from './energeticos/widgets/porcentajes-graficas/porcentajes-graficas.component';
import { GasolineriasComponent } from './gasolinerias/gasolinerias.component';
import { DetalleGasolineriasComponent } from './gasolinerias/detalle-gasolinerias/detalle-gasolinerias.component';
import { GraficaPersonalComponent } from './energeticos/widgets/grafica-personal/grafica-personal.component';

@NgModule({
  declarations: [
    EnergeticosComponent,
    TotalesComponent,
    TotalesGraficaComponent,
    DetalleEnergeticosComponent,
    AnualComponent,
    TablaComponent,
    GraficaBarraComponent,
    PorcentajesGraficasComponent,
    GasolineriasComponent,
    DetalleGasolineriasComponent,
    GraficaPersonalComponent,
  ],
  imports: [
    CommonModule,
    LandingPagesRoutingModule,
    ChartModule,
    DataTablesModule,
    HighchartsChartModule
  ],
  providers: [
    DatePipe
  ]
})
export class LandingPagesModule { }
