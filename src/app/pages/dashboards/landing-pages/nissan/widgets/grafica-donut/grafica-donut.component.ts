import { Component, Input, OnInit, AfterViewInit } from "@angular/core";

/**
 * Componente que genera una gráfica de "Pastel (Donut)" para mostrar porcentajes por conceptos
 * (componente no actualizable)
 * @component gráfica barras costos financieros dashboard
 */
@Component({
  selector: "app-grafica-donut",
  templateUrl: "./grafica-donut.component.html",
  styleUrl: "./grafica-donut.component.css",
})
export class GraficaDonutComponent implements AfterViewInit {
  @Input() concepto: string;
  @Input() tipo:any;
  @Input() dataMes:any;
  @Input() dataMesAnterior:any;

  // public dataEnergeticos: any;
  public dataAnual: any = [];
  public money:any = ''

  public dataAnualAnt: any = [];

  public totalMes: number = 0;
  public totalMesAnt: number = 0;
  public diferencia: number = 0;

  public total2: string = "0";
  private labels: any;
  private serie: any;
  public title: any;

  public chart: any;
  public options = {
    series: [44, 55, 13, 43, 22],
    chart: {
      type: "donut",
    },
    // colors: [
    //   "#feb019", // Amarillo brillante (categoría destacada)
    //   "#ff4560", // Rojo intenso
    //   "#008ffb", // Azul claro vibrante
    //   "#049764ff", // Verde fuerte
    //   "#035686ff",  // Azul casi negro (último, menos dominante)
    //   "#6a37e2ff", // Gris neutro
    //   "#1c3db3ff", // Azul oscuro
    // ],

    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontWeight: 600,
              fontSize: "22px",
            },
            value: {
              show: true,
              fontSize: "16px",
              formatter: function (val) {
                return Number(val).toLocaleString();
              },
            },
            total: {
              show: true,
              label: "Total",
              fontWeight: 550,
              formatter: function (w) {
                return w.globals.seriesTotals
                  .reduce((a, b) => {
                    return a + b;
                  }, 0)
                  .toLocaleString();
              },
            },
          },
        },
      },
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toLocaleString("en-US");
        },
      },
    },
    responsive: [
      {
        breakpoint: 1500,
        options: {
          chart: {
            
          },
          legend: {
            show: false,
            
          },
        },
      },
    ],
  };

  constructor(
  ) {}

  ngAfterViewInit(): void {
    this.setTitle();
    this.inicializarGrfica();
  }

  /**
   * Inicializa la gráfica
   */
  private inicializarGrfica() {
    // this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    if (this.dataMes.length > 1) {
      this.generarLabels();
      this.generarSerie();
      this.options.series = this.serie;
      this.options.labels = this.labels;
    } else {
      this.options.series = [100];
      this.options.labels = ["Sin datos"];
    }
    this.chart = new ApexCharts(
      document.querySelector("#chart_dona_" + this.concepto),
      this.options
    );
    this.chart.render();
  }

  /**
   * genera las etiquetas de las graficas
   */
  private generarLabels() {
    let data: any = [];
    for (let i = 0; i < this.dataMes.length; i++) {
      if (this.dataMes[i]["estacion"] != "Total") {
        const element = this.dataMes[i]["estacion"];
        data.push(element);
      }
    }
    this.labels = data;
  }

  /**
   * Transforma valores negativos a valores positivos
   * @param value numero de la serie
   * @returns numero positivo
   */
  private valueNegative(value: number) {
    if (value < 0) {
      return value * -1;
    } else {
      return value;
    }
  }

  /**
   * Genera la serie para la gráfica
   */
  private generarSerie() {
    let data: any = [];
    let total = this.dataMes.find(
      (registro) => registro.estacion === "Total"
    );
    this.totalMes = total[this.concepto];

    let totalMA = this.dataMesAnterior.find(
      (registro) => registro.estacion === "Total"
    );
    this.totalMesAnt = totalMA[this.concepto];

    this.diferencia = this.totalMes - this.totalMesAnt;

    for (let i = 0; i < this.dataMes.length; i++) {
      if (this.dataMes[i]["estacion"] != "Total") {
        const element = this.valueNegative(
          Number(this.dataMes[i][this.concepto])
        );
        data.push(element);
      }
    }
    this.serie = data;
  }

  /**
   * Recupera el total del concepto
   * @returns total del concepto
   */
  public getTotal() {
    let total = this.dataMes.find(
      (registro) => registro.estacion === "Total"
    );
    return String(total[this.concepto]) || "0";
  }

  /**
   * asigna un titulo al card
   */
  private setTitle() {
    switch (this.concepto) {
      case "ventas_servicio":
        this.money = "$"
        this.title = "Ventas Servicio";
        break;
      case "gasto":
        this.money = "$"
        this.title = "Gastos";
        break;
      case "personal":
        this.title = "Personal";
        break;
      case "bono_marca":
        this.money = "$"
        this.title = "Bonos Marcas";
        break;
      case "servicio":
        this.money = "$"
        this.title = "Servicio";
        break;
      case "hyp":
        this.money = "$"
        this.title = "HyP";
        break;
      default:
        break;
    }
  }
}
