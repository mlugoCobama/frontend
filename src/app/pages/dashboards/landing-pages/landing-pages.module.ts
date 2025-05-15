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
import { NissanComponent } from './nissan/nissan.component';
import { RenaultComponent } from './renault/renault.component';
import { TotalesUtilidadGraficaComponent } from './nissan/widgets/totales-utilidad-grafica/totales-utilidad-grafica.component';
import { GraficaDonutComponent } from './nissan/widgets/grafica-donut/grafica-donut.component';
import { GraficaRadialComponent } from './nissan/widgets/grafica-radial/grafica-radial.component';
import { TotalesPorcentajeGraficaComponent } from './nissan/widgets/totales-porcentaje-grafica/totales-porcentaje-grafica.component';
import { BarrasHorizontalesMetasComponent } from './nissan/widgets/barras-horizontales-metas/barras-horizontales-metas.component';
import { GraficaBarrasTotalesComponent } from './nissan/widgets/grafica-barras-totales/grafica-barras-totales.component';
import { CardPrestamosComponent } from './nissan/widgets/card-prestamos/card-prestamos.component';
import { StackGraficaComponent } from './nissan/widgets/stack-grafica/stack-grafica.component';
import { PorcentajeEficienciaComponent } from './energeticos/widgets/porcentaje-eficiencia/porcentaje-eficiencia.component';

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
    NissanComponent,
    RenaultComponent,
    TotalesUtilidadGraficaComponent,
    GraficaDonutComponent,
    GraficaRadialComponent,
    TotalesPorcentajeGraficaComponent,
    BarrasHorizontalesMetasComponent,
    GraficaBarrasTotalesComponent,
    CardPrestamosComponent,
    StackGraficaComponent,
    PorcentajeEficienciaComponent,
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
