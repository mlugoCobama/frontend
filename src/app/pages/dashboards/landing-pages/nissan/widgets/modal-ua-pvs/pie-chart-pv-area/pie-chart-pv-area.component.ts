import { AfterViewInit, Component, Input, OnInit, OnDestroy } from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-pie-chart-pv-area",
  templateUrl: "./pie-chart-pv-area.component.html",
  styleUrl: "./pie-chart-pv-area.component.css",
})
export class PieChartPvAreaComponent implements AfterViewInit, OnDestroy {
  @Input() id: any;
  @Input() mes: any;
  @Input() mesAnt: any;
  @Input() anioAnt: any;
  @Input() concepto: any;
  @Input() concepto2: any;

  public dataEnergeticos: any;
  public areas: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public total: number[] = [];
  public chart: any;
  private labels: any;
  private serie: any;

  public options = {
    series: [],
    chart: {
      width: "400",
      type: "donut",
    },
    labels: [],
    noData: {
      text: "Loading...",
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toLocaleString("en-US");
        },
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: false,
          },
        },
      },
      {
        breakpoint: 810,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService
  ) {}

  ngAfterViewInit(): void {
    this.asignarAreas();
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

  private asignarAreas() {
    if (this.concepto === "area_comercial") {
      this.areas = ["area_nuevos", "area_flotillas", "area_seminuevos"];
    } else {
      this.areas = ["area_servicio", "area_refacciones", "area_hyp"];
    }
  }
  /**
   * Inicializa los valores de las gráficas
   */
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    if (this.dataEnergeticos.mes.length > 1) {
      this.generarLabels();
      this.generarSerie();
      this.options.series = this.serie;
      this.options.labels = this.labels;
    } else {
      this.options.series = [100];
      this.options.labels = ["Sin datos"];
    }
    this.chart = new ApexCharts(
      document.querySelector(
        "#chart_participacion_" + this.id + "_" + this.concepto
      ),
      this.options
    );

    this.chart.render();
  }

  /**
   * Actualiza los valores de la grafica
   */
  private actualizarGrafica() {
    this.generarLabels();
    this.generarSerie();
    this.options.series = this.serie;
    this.options.labels = this.labels;

    this.chart.updateOptions(this.options);
  }
  public dataMes: any;
  /**
   * Genera las series de la gráfica
   */
  private generarSerie() {
    let data: any = [];
    this.dataMes = this.mes.filter((fila) => fila.id == this.id);
    for (let i = 0; i < this.areas.length; i++) {
      const element = this.valueNegative(
        Number(this.dataMes[0][this.areas[i] ?? 0])
      );
      data.push(element);
    }
    this.serie = data;
  }

  /**
   * Manejo de valores negativos
   */
  private valueNegative(value: number) {
    if (value < 0) {
      return value * -1;
    } else {
      return value;
    }
  }

  /**
   * Genera las etiquetas de las series de las gráficas
   */
  private generarLabels() {
    let data: any = [];
    for (let i = 0; i < this.areas.length; i++) {
      const element = this.areas[i];
      data.push(this.formatearTexto(element));
    }
    this.labels = data;
  }

  public formatearTexto(texto) {
    const capitalCaseText =
      String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
    let textoFormateado = capitalCaseText.replace("_", " ");
    return textoFormateado;
  }
}
