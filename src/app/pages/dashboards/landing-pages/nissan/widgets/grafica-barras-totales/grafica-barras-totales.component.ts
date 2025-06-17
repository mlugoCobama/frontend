import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

/**
 * Componente que genera una gráfica de " Barras" para mostrar costos financieros
 * (componente no actualizable)
 * @component gráfica barras costos financieros dashboard
 */
@Component({
  selector: 'app-grafica-barras-totales',
  templateUrl: './grafica-barras-totales.component.html',
  styleUrl: './grafica-barras-totales.component.css'
})

export class GraficaBarrasTotalesComponent implements AfterViewInit {
  @Input() dataMes: any[];
  @Input() dataMesAnterior: any[];

  @Input() concepto: string;
  @Input() tipo:any;

  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;

  public conceptos: string[] = [];
  public title: string;

  public money: string = "";

  public diferencia: number = 0;
  public totalMes: number = 0;
  public totalMesAnt: number = 0;


  private dataSerie: number[] = [];
  private dataSerieMA: number[] = [];

  public options = {
    
    series: [
      {
        name: "Costo financiero",
        data: [400, 430, 448, 470, 540,]
      }
    ],
    chart: {
      type: "bar",
      toolbar:{
        show:false
      },
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    tooltip: {
      y: {
        formatter:  function(value){
          return value.toLocaleString('en-US');
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        "Nuevos",
        "Flotillas",
        "Refacciones",
        "Bajio",
        "Intercias",
      ]
    },
    responsive: [
      {
        breakpoint: 1400,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  constructor(
  ) { }

  ngAfterViewInit(): void {
    
    this.setTitle();
    this.setDataSerie();
    this.calcularTotales(); 
    this.incializarGrafica();
  }

  /**
   * Inicializa la gráfica y asigna los nuevos valores a la serie 
   */
  public incializarGrafica(){
    this.options.series[0].data = this.dataSerie;
    var chart = new ApexCharts(
      document.querySelector("#chart_barras_" + this.concepto),
      this.options
    );
    chart.render();
  }

  /**
   * Calcula los totales de las series mes y mes anterior
   * y diferencia 
   */
  public calcularTotales(){
    this.totalMes = this.dataSerie.reduce((a, b) => {return a + b}, 0)
    this.totalMesAnt = this.dataSerieMA.reduce((a, b) => {return a + b}, 0)
    this.diferencia =  this.totalMes - this.totalMesAnt;
  }
  
  /**
   * Asigna un titulo en base al concepto dado
   * Conceptos =  Conceptos de los que se requiere el total
   */
  private setTitle() {
    switch (this.concepto) {
      case "costos_financieros":
        this.title = "Costos financieros";
        this.conceptos = ['costo_nuevos', 'costo_flotillas', 'refacciones', 'bajio', 'intercias'] 
        this.money = "$";
        break;
      default:
        break;
    }
  }

  /**
   * Genera las series a partir de los totales de cada mes 
   */
  private setDataSerie() {
    let filaTotales = this.dataMes.find((registro) => registro.estacion === "Total");
    let filaTotalesMesAnt = this.dataMesAnterior.find((registro) => registro.estacion === "Total");
      this.conceptos.forEach( concepto => {
        const value = Number(filaTotales[concepto] || 0);
        const valueMA = Number(filaTotalesMesAnt[concepto] || 0);
        this.dataSerie.push(value);
        this.dataSerieMA.push(valueMA);
      });
  }
  
}

