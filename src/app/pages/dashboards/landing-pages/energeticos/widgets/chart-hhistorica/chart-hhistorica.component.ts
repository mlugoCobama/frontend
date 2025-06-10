import {  Component, Input, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

import * as Highcharts from "highcharts/highstock";

@Component({
  selector: "app-chart-hhistorica",
  templateUrl: "./chart-hhistorica.component.html",
  styleUrl: "./chart-hhistorica.component.css",
})

export class ChartHhistoricaComponent implements OnInit, OnDestroy {
  @Input() concepto: string;
  @Input() titulo: string;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;
  
  public  isOpen1: boolean = true;
  public  dataAnual: any = [];
  public  dataAnualAnt: any = [];
  public  dataAnualAnt2: any = [];

  isHighcharts = typeof Highcharts === "object";
  updateFlag = false;
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
      type: "datetime",
    },

    yAxis: {
      title: {
        text: "Miles de Pesos",
      },
      plotLines: [
        {
          color: "#7F8CAA",
          width: 2,
          value: 0,
        },
      ],
    },

    lang: {
      locale: "es",
      thousandsSep: ",",
    },

    series: [
      {
        name: "Grafico historico",
        data: [
          [String(1685971800000), 179.58],
          [String(1686058200000), 179.21],
          [String(1686144600000), 177.82],
          [String(1686231000000), 180.57],
        ],
        type: "area",
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "#007bff"],
            [1, "#ffffff"],
          ],
        },
      },
    ],
    rangeSelector: {
      selected: 1,
      buttons: [
        { type: "month", count: 6, text: "6 m" },
        { type: "year", count: 1, text: "1 A" },
        { type: "all", text: "Todo" },
      ],
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

  ngOnDestroy(): void {
    this.actualizarDatosSubscripcion.unsubscribe();
  }
  /**
  * Inicializa la gráfica y asigna las opciones al gráfico
  */
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    let serie = [
      this.dataAnualAnt2.concat(this.dataAnualAnt.concat(this.dataAnual)),
    ];
    this.chartOptions.series = [
      {
        name: this.formatearTexto(this.concepto),
        data: serie[0],

        type: "areaspline",
        zones: [
          {
            value: 0,
            color: "red",
          },
        ],
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#007bff"],
            [1, "#ffffff"],
          ],
        },
      },
    ];
    this.chartOptions.title.text = `Histórico: ${this.formatearTexto(
      this.concepto
    )} - ${this.setTitle()}`;
    this.updateFlag = true;
  }

  /**
  *  Actualiza la gráfica y asigna las opciones al gráfico
  */
  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    let serie = [
      this.dataAnualAnt2.concat(this.dataAnualAnt.concat(this.dataAnual)),
    ];
    this.chartOptions.series = [
      {
        name: this.formatearTexto(this.concepto),
        data: serie[0],
        type: "areaspline",
        zones: [
          {
            value: 0,
            color: "red",
          },
        ],
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#007bff"],
            [1, "#ffffff"],
          ],
        },
      },
    ];
    this.chartOptions.title.text = `Histórico: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`;
    this.updateFlag = true;
  }

  /**
   * Retira del texto "_" y pone la primer letra en mayúscula
   * @param texto String a formatear
   * @returns "texto_ejemplo" a "Texto ejemplo"
   */
  public formatearTexto(texto) {
    const capitalCaseText =
      String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
    let textoFormateado = capitalCaseText.replace("_", " ");
    return textoFormateado;
  }

  /**
   * Genera la serie en base a los datos del año dado
   * @param datos Data anual del año a recuperar
   * @returns array [[datetime, dato]...] o array [ ] 
   */
  private generarSerie(datos:any){
    let data: any = [];
    if(datos.length > 0){
      for (let i = 0; i < datos.length; i++) {
        data.push([
          new Date(datos[i]["fecha"]).getTime(),
          Number(datos[i][this.concepto]) || 0,
        ]);
      }
      return data;
    }else{
      return data;
    }
  }

  /**
   * Genera la serie del año actual o mas reciente
   */
  private serieAnio(){
    this.dataAnual = this.generarSerie(this.dataEnergeticos.totalAnio);
  }

  /**
   * Genera la serie a partir de año anterior ,
   * asigna el resultado a "dataAnualAnt"
   */
  private serieAnioAnt(){
    this.dataAnualAnt = this.generarSerie(this.dataEnergeticos.totalAnioAnt);
  }
  /**
  * Genera la serie a partir de año anterior - 1 ,
  * asigna el resultado a "dataAnualAnt2"
  */
  private serieAnioAnt2(){
    this.dataAnualAnt2 = this.generarSerie(this.dataEnergeticos.totalAnioAnt2);
  }


  /**
   * Asigna un titulo a la gráfica
   * @returns Cadena de texto con el titulo
   */
  public setTitle() {
    switch (this.dataEnergeticos.totalAnio[0].estacion) {
      case undefined:
        return "Total";
        break;
      case "Planta":
        return this.dataEnergeticos.totalAnio[0].entidad;
        break;
      default:
        return this.dataEnergeticos.totalAnio[0].estacion;
        break;
    }
  }
}
