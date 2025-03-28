import { Component, Input, OnInit } from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

import * as Highcharts from "highcharts";

@Component({
  selector: "app-anual",
  templateUrl: "./anual.component.html",
  styleUrls: ["./anual.component.css"],
})
export class AnualComponent implements OnInit {
  @Input() concepto: string;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

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

  public chart: any;
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    let serie = [this.dataAnualAnt, this.dataAnual];
    this.chartOptions.series = serie;
    // console.groupCollapsed(this.dataEnergeticos);
    this.updateFlag = true;
  }

  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    let serie = [this.dataAnualAnt, this.dataAnual];

    this.chartOptions.series = serie;
    this.updateFlag = true;
  }

  private serieAnio() {
    let data: any = [];
    if (this.dataEnergeticos.totalAnio.length > 1) {
      for (let i = 0; i < this.dataEnergeticos.totalAnio.length; i++) {
        const element = Number(
          this.dataEnergeticos.totalAnio[i][this.concepto]
        );
        data.push(element);
      }

      this.dataAnual = {
        name: String(
          new Date(this.dataEnergeticos.totalAnio[0]["fecha"]).getFullYear() + 1
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
    if (this.dataEnergeticos.totalAnioAnt.length > 1) {
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
          ).getFullYear() + 1
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
}
