import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'app-anual',
  templateUrl: './anual.component.html',
  styleUrls: ['./anual.component.css']
})
export class AnualComponent implements OnInit {

  @Input() concepto: string;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public options = {
    chart: {
      height: 200,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#FF1654", "#247BA0"],
    series: [
      {
        name: "Series A",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
      },
      {
        name: "Series B",
        data: [20, 29, 37, 36, 44, 45, 50, 58]
      }
    ],
    stroke: {
      width: [4, 4]
    },
    plotOptions: {
      bar: {
        columnWidth: "20%"
      }
    },
    xaxis: {
      categories: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#FF1654"
        },
        labels: {
          style: {
            colors: "#FF1654"
          }
        },
        title: {
          text: "Series A",
          style: {
            color: "#FF1654"
          }
        }
      },
      {
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#247BA0"
        },
        labels: {
          style: {
            colors: "#247BA0"
          }
        },
        title: {
          text: "Series B",
          style: {
            color: "#247BA0"
          }
        }
      }
    ],
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false
      }
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40
    }
  }

  constructor(
      private localStorage: LocalStorageServiceService,
      private gaseras : EnergeticosGaserasService
    ) {}

  ngOnInit(): void {
    this.inicializarGrfica();
    this.actualizarDatosSubscripcion =
    this.gaseras.actualizarData$.subscribe(() => {
      this.actualizarGrafica();
    });
  }

  public chart:any;
  private inicializarGrfica(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.serieAnio();
    this.serieAnioAnt();
    let serie = [
      this.dataAnualAnt,
      this.dataAnual
    ]
    this.options.series = serie;
    this.chart = new ApexCharts(document.querySelector("#chart_anual"), this.options);
    this.chart.render();
    console.groupCollapsed(this.dataEnergeticos);
  }

  private actualizarGrafica(){
    // var chart = 
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.serieAnio();
    this.serieAnioAnt();
    let serie = [
      this.dataAnualAnt,
      this.dataAnual
    ]
    this.options.series = serie;

    // chartrender();
    this.chart.updateOptions(this.options)
  }

  private serieAnio(){
    let data:any = [];
    for (let i = 0; i < this.dataEnergeticos.totalAnio.length; i++) {
      const element = this.dataEnergeticos.totalAnio[i][this.concepto];      
      data.push(element);
    }

    this.dataAnual = {
      name: new Date(this.dataEnergeticos.totalAnio[0]['fecha']).getFullYear() + 1,
      data: data
    }
  }

  private serieAnioAnt(){
    let data:any = [];
    for (let i = 0; i < this.dataEnergeticos.totalAnioAnt.length; i++) {
      const element = this.dataEnergeticos.totalAnioAnt[i][this.concepto];
      data.push(element);
    }
    this.dataAnualAnt = {
      name: new Date(this.dataEnergeticos.totalAnioAnt[0]['fecha']).getFullYear() +1,
      data: data
    }
  }

}
