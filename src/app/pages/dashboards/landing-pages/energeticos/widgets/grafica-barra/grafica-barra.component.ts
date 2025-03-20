import { Component, Input, OnInit } from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";

import * as Highcharts from "highcharts";
import { Subscription } from "rxjs";
import { formatNumber } from "@angular/common";
@Component({
  selector: "app-grafica-barra",
  templateUrl: "./grafica-barra.component.html",
  styleUrl: "./grafica-barra.component.css",
})
export class GraficaBarraComponent implements OnInit {
  @Input() concepto: string;

  private dataEnergeticos: any;
  private labels: any;
  private actualizarDatosSubscripcion: Subscription;

  public dataMensual: any = [];

  public dataMensualAnt: any = [];

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  chartOptions: Highcharts.Options = {
    title: {
      text: "Mensual",
    },
    xAxis: {
      categories: [
        "Servigas del Valle",
        "Gas Urbano",
        "Gas Multiregional",
        "Gasamex",
        "Reyes Gas",
        "Iztagas y Energia",
        "Flamamex",
        "Azteca Gas",
        "Satelite Gas",
        "Garza Gas",
        "Garza Sur",
        "Segas",
        "Zugas",
        "Gas Premio",
      ],
      title: {
        text: null,
      },
      gridLineWidth: 1,
      lineWidth: 0,
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
      column: {
        colorByPoint: true
      },
    },
    series: [
      {
        name: "2025",
        data: [
          16.0, 18.2, 23.1, 27.9, 32.2, 36.4, -39.8, 38.4, -35.5, 29.2, 22.0,
          17.8, 25.6,
        ],
        type: "bar",
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
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    if (this.dataEnergeticos.mes.length > 1) {
      this.generarSerie();
      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          ...this.chartOptions.xAxis,
          categories: this.labels,
        },
        series: [this.dataMensual],
      };
    } else {
      this.chartOptions = {
        ...this.chartOptions,
        xAxis: {
          ...this.chartOptions.xAxis,
          categories: ["sin datos"],
        },
        series: [
          {
            name: "Sin datos",
            data: [0],
            type: "bar",
          },
        ],
      };
    }
    this.updateFlag = true;
  }

  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    if (this.dataEnergeticos.mes.length > 1) {
      this.generarSerie();
      this.chartOptions.series = this.dataMensual;
      this.chartOptions.xAxis["categories"] = this.labels;
    } else {
      this.chartOptions.series = [{
            name: "Sin datos",
            data: [0],
            type: "bar",
          },];
      this.chartOptions.xAxis["categories"] = ["Sin datos"];
    }
    this.updateFlag = true;
  }

  private generarSerie() {
    let data: any = [];
    for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
      if(this.dataEnergeticos.mes[i]["entidad"] != 'Total'){
        const element = Number(this.dataEnergeticos.mes[i][this.concepto]);
        const entidad = this.dataEnergeticos.mes[i]["entidad"];
        data.push({ valor: element, entidad: entidad });
      }
      
    }
    data.sort((a, b) => b.valor - a.valor);
    this.labels = data.map((item) => item.entidad);
    const valoresOrdenados = data.map((item) => item.valor);
    this.dataMensual = {
      data: valoresOrdenados,
      name: String(
        new Date(this.dataEnergeticos.mes[1]["fecha"]).getFullYear()
      ),
      type: "bar",
    };
  }
}
