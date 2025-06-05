import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

import * as Highcharts from "highcharts/highstock";

@Component({
  selector: "app-chart-hhistorica",
  templateUrl: "./chart-hhistorica.component.html",
  styleUrl: "./chart-hhistorica.component.css",
})
export class ChartHhistoricaComponent implements OnInit {

  @Input() concepto: string;
  @Input() titulo: string;
  updateFlag = false;
  isOpen1:boolean = false;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;
 
  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public dataAnualAnt2: any = [];

  isHighcharts = typeof Highcharts === "object";
  title = "UnivHighCharts";
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = "stockChart";
  chartOptions: Highcharts.Options = {
    chart: {
      height: 400,
    },
    title: {
      text: "Grafica Historica",
    },
    navigator: {
      enabled: true,
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      type: 'datetime'
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
    
    lang: {
        locale: 'es'
    },

    series: [
      {
        name: "AAPL Stock Price",
        data: [
          [String(1685971800000), 179.58],
          [String(1686058200000), 179.21],
          [String(1686144600000), 177.82],
          [String(1686231000000), 180.57],
        ],
        type: "area",
        threshold: null,
        tooltip: {
          valueDecimals: 5,
        },
        fillColor: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                // [0, '#003399'],
                // [1, '#3366AA']
                [0, '#050C9C'],
                [1, '#A7E6FF'],

              ]     
            }
      } 
    ],
    rangeSelector: {
        selected: 1,
        buttons: [
          // { type: 'month', count: 3, text: '3m' },
          { type: 'month', count: 6, text: '6 m' },
          { type: 'year', count: 1, text: '1 A' },
          { type: 'all', text: 'Todo' }
        ]
      },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 300,
            },
            subtitle: {
              text: null,
            },
            navigator: {
              enabled: true,
            },
          },
        },
      ],
    },
  };



  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService
  ) {}

  ngOnInit() {
    this.inicializarGrfica();
    this.actualizarDatosSubscripcion = this.gaseras.actualizarData$.subscribe(
       () => {
         this.actualizarGrafica();
       }
     );
  }

  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    let serie = [this.dataAnualAnt2.concat(this.dataAnualAnt.concat(this.dataAnual))];
    this.chartOptions.series = [
      {
        name: this.concepto,
        data: 
          serie[0],
        
        type: 'areaspline',
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, '#007bff'],
          [1, '#ffffff'],
        ],
      },
        
      },
    ]
    this.chartOptions.title.text =  `Histórico: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    let serie = [this.dataAnualAnt2.concat(this.dataAnualAnt.concat(this.dataAnual))];
    this.chartOptions.series = [
      {
        name: this.concepto,
        data: 
          serie[0],
        
        type: 'areaspline',
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, '#007bff'],
          [1, '#ffffff'],
        ],
      },
        
      },
    ]
    this.chartOptions.title.text =  `Histórico: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

    public formatearTexto(texto){
    const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
    let textoFormateado = capitalCaseText.replace("_", " ")
    return textoFormateado;
  }

  private serieAnio() {
    let data: any = [];
    if(this.dataEnergeticos.totalAnio.length > 0){
      for (let i = 0; i < this.dataEnergeticos.totalAnio.length; i++) {
        data.push( [(new Date(this.dataEnergeticos.totalAnio[i]['fecha']).getTime()) , Number(this.dataEnergeticos.totalAnio[i][this.concepto]) || 0] );
      }
      this.dataAnual = data;
    }else{
      this.dataAnual = [];
    }
  }

  private serieAnioAnt() {
    let data: any = [];
    if(this.dataEnergeticos.totalAnioAnt.length > 0){
      for (let i = 0; i < this.dataEnergeticos.totalAnioAnt.length; i++) {
      data.push( [(new Date(this.dataEnergeticos.totalAnioAnt[i]['fecha']).getTime()) , Number(this.dataEnergeticos.totalAnioAnt[i][this.concepto]) || 0] );
    }
    this.dataAnualAnt = data;
    }else{
      this.dataAnualAnt = [];
    }
    
  }

  private serieAnioAnt2() {
    let data: any = [];
    if(this.dataEnergeticos.totalAnioAnt2.length){
      for (let i = 0; i < this.dataEnergeticos.totalAnioAnt2.length; i++) {
      data.push( [(new Date(this.dataEnergeticos.totalAnioAnt2[i]['fecha']).getTime()) , Number(this.dataEnergeticos.totalAnioAnt2[i][this.concepto]) || 0] );
    }
    this.dataAnualAnt2 = data;
    }else{
      this.dataAnualAnt2 = [];
    }
    
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
}
