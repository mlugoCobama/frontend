import { Component, Input, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

import * as Highcharts from "highcharts";

@Component({
  selector: "app-anual",
  templateUrl: "./anual.component.html",
  styleUrls: ["./anual.component.css"],
})
export class AnualComponent implements OnInit, OnDestroy{
  @Input() concepto: string;
  @Input() titulo: string;
  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;
 
  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public dataAnualAnt2: any = [];

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    title: {
      text: "Anual",
    },
    xAxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
    },
    yAxis: {
      title: {
        text: "Miles de Pesos",
      },
      plotLines: [
      {
        color: '#7F8CAA',
        width: 2,
        value: 0
      }
    ],
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
      {
        name: "2024",
        data: [
          -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5, 2.0, -0.9,
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
   this.inicializarGrfica();
   this.actualizarDatosSubscripcion = this.gaseras.actualizarData$.subscribe(
       () => {
         this.actualizarGrafica();
       }
     );
   }
   ngOnDestroy(): void {
     this.actualizarDatosSubscripcion.unsubscribe();
   }


  public chart: any;
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    // const prediccion2 = this.seriePrediccion(this.dataAnual);

    let serie = [this.dataAnualAnt2, this.dataAnualAnt, this.dataAnual];
    this.chartOptions.series = serie;
    this.chartOptions.title.text =  `Anual: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    // const prediccion2 = this.seriePrediccion(this.dataAnual);
    let serie = [this.dataAnual, this.dataAnualAnt, this.dataAnualAnt2];
    this.chartOptions.series = serie;
    this.chartOptions.title.text =  `Anual: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

  


  public setTitle(){

    switch (this.dataEnergeticos.totalAnio[0].estacion) {
      case undefined:
        return 'Total';
        break;
      case 'Planta':
        return this.dataEnergeticos.totalAnio[0].entidad
        break;
      default:
        return this.dataEnergeticos.totalAnio[0].estacion
        break;
    }
  }

  public formatearTexto(texto){
    const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
    let textoFormateado = capitalCaseText.replace("_", " ")
    return textoFormateado;
  }

  private serieAnio() {
    let data: any = [];
    if (this.dataEnergeticos.totalAnio.length > 0) {
      for (let i = 0; i < this.dataEnergeticos.totalAnio.length; i++) {
        const element = Number(
          this.dataEnergeticos.totalAnio[i][this.concepto]
        );
        data.push(element);
      }

      this.dataAnual = {
        name: String(
          new Date(this.dataEnergeticos.totalAnio[0]["fecha"]).getFullYear() 
        ),
        data: data,
        type: "line",
      };
    } else {
      this.dataAnual = {
        name: "sin datos",
        data: data,
        type: "line",
      };
    }
  }

  private serieAnioAnt() {
    let data: any = [];
    if (this.dataEnergeticos.totalAnioAnt.length > 0) {
      for (let i = 0; i < this.dataEnergeticos.totalAnioAnt.length; i++) {
        const element = Number(
          this.dataEnergeticos.totalAnioAnt[i][this.concepto]
        );
        data.push(element);
      }
      this.dataAnualAnt = {
        name: String(
          new Date(
            this.dataEnergeticos.totalAnioAnt[0]["fecha"]
          ).getFullYear() 
        ),
        data: data,
        type: "line",
      };
    } else {
      this.dataAnualAnt = {
        name: "sin datos",
        data: data,
        type: "line",
      };
    }
  }

  private serieAnioAnt2() {
    let data: any = [];
    if (this.dataEnergeticos.totalAnioAnt2.length > 0) {
      for (let i = 0; i < this.dataEnergeticos.totalAnioAnt2.length; i++) {
        const element = Number(
          this.dataEnergeticos.totalAnioAnt2[i][this.concepto]
        );
        data.push(element);
      }
      this.dataAnualAnt2 = {
        name: String(
          new Date(
            this.dataEnergeticos.totalAnioAnt2[0]["fecha"]
          ).getFullYear() 
        ),
        data: data,
        type: "line",
      };
    } else {
      this.dataAnualAnt2 = {
        name: "sin datos",
        data: data,
        type: "line",
      };
    }
  }

    private seriePrediccion(data) {
    const datos = [...this.dataAnualAnt.data, ...data.data];
    let serie;
    const prediccion = this.predecirRestantes(datos);

    const mesesExcluidos = data.data.map(() => null);
    let seriePrediccion = [];
    if(mesesExcluidos.length <= 12){
      seriePrediccion = mesesExcluidos.concat(prediccion.slice(mesesExcluidos.length-12, prediccion.length));
    }else{
      seriePrediccion = prediccion;
    }
    
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
