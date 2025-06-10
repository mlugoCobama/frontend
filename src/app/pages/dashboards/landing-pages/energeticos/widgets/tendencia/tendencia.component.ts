import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from "highcharts";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'app-tendencia',
  templateUrl: './tendencia.component.html',
  styleUrl: './tendencia.component.css'
})
export class TendenciaComponent implements OnInit, OnDestroy{
  @Input() concepto: string;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public chart: any;

  public diferencia: any;

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    title: {
      text: "Tendencia",
    },
    xAxis: {
      categories: ["Ene","Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
    },
    yAxis: {
      title: {
        text: "Miles de Pesos",
      },
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },
    series: [
      {
        name: "2025",
        data: [
          16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2, 22.0,
          17.8,
        ],
        type: "line",
      },
    ],
  };

    constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService
  ) {}

  ngOnInit(): void {
    // this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    
    this.inicializarGrfica();
    this.actualizarDatosSubscripcion = this.gaseras.actualizarData$.subscribe(
       () => {
         this.inicializarGrfica();
       }
     );

  }

  ngOnDestroy(): void {
    this.actualizarDatosSubscripcion.unsubscribe();
  }
  
    private inicializarGrfica() {
    this.recuperarDatos();
    
    const prediccion2 = this.seriePrediccion(this.dataAnual);

    let serie = [prediccion2];
    this.chartOptions.series = serie;

    this.updateFlag = true;
  }

  private recuperarDatos(){
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    let dataAnual = this.dataEnergeticos.totalAnio.map((dato) => Number(dato[this.concepto]));
    let dataAnualAnt = this.dataEnergeticos.totalAnioAnt.map((dato) => Number(dato[this.concepto]));

    this.dataAnual = {
        name: String(
          new Date(this.dataEnergeticos.totalAnio[0]["fecha"]).getFullYear()
        ),
        data: dataAnual,
        type: "line",
      };
    
    this.dataAnualAnt = {
        // name: String(
        //   new Date(this.dataEnergeticos.totalAnioAnt[0]["fecha"]).getFullYear()
        // ),
        data:  dataAnualAnt,
        // type: "line",
      };
  }
    private seriePrediccion(data) {
    const datos = [...this.dataAnualAnt.data, ...data.data];
    let serie;
    const prediccion = this.predecirRestantes(datos);
    this.diferencia = (prediccion[prediccion.length-1]) - prediccion[0];
    const mesesExcluidos = data.data.map(() => null);
    const seriePrediccion = mesesExcluidos.concat(prediccion);
    serie = {
      name: `Tendencia ${data.name}`,
      type: "line",
      data: seriePrediccion,
      dashStyle: "ShortDash",
      color: "#f39c12",
      marker: {
        enabled: false,
      },
      dataLabels: {
        enabled: false
      }
    };
    return serie;
  }

  predecirRestantes( totales: number[], inicioMes = 1 ,totalMeses = 24): number[] {
    const n = totales.length;
    const x = Array.from({ length: n }, (_, i) => i + inicioMes);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = totales.reduce((a, b) => a + b, 0);
    const sumXY = totales.reduce((acc, y, i) => acc + y * x[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    const b = (sumY - m * sumX) / n;

    const predicciones: number[] = [];
    for (let i = n + inicioMes; i <= totalMeses; i++) {
      predicciones.push(Math.round(m * i + b));
    }
    return predicciones;
  }
}
