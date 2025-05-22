import { Component , Input, OnInit} from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-grafica-radial',
  templateUrl: './grafica-radial.component.html',
  styleUrl: './grafica-radial.component.css'
})
export class GraficaRadialComponent implements OnInit{
  @Input() concepto: string;
  @Input() tipo:any;

  public dataEnergeticos: any;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public total: number = 0;
  public total2: string = "0";
  private labels: any;
  private serie: any;
  public title: any;

  public chart:any;
  public options = {
    series: [44, 55, 67, 83],
    chart: {
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px"
          },
          value: {
            fontSize: "16px"
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b
              }, 0).toLocaleString();
            }
          }
        }
      }
    },
    labels: ["Apples", "Oranges", "Bananas", "Berries"]
  };

    constructor(
      private localStorage: LocalStorageServiceService,
    ) {}

    ngOnInit(): void {
      this.setTitle();
      this.inicializarGrfica();
    }


    private inicializarGrfica(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    if(this.dataEnergeticos.mes.length > 1){
    this.generarLabels();
    this.generarSerie();
    this.options.series = this.serie;
    this.options.labels = this.labels;
    
    }else{
      this.options.series = [100];
      this.options.labels = ['Sin datos'];
    }
      this.chart = new ApexCharts(document.querySelector("#chart_radial"), this.options);
      this.chart.render();
    }

    private generarLabels(){
      let data:any = [];
      for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
        if(this.dataEnergeticos.mes[i]["estacion"] != 'Total'){
          const element = this.dataEnergeticos?.mes[i]['estacion'];
          data.push(element);
        }
      }
      this.labels = data;
    }

    private valueNegative( value: number ) {
      if (value < 0) {
        return value * -1;
      } else {
        return value;
      }
    }

    private generarSerie(){
      let data:any = [];
      
      let total =  this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
      this.total =total[this.concepto];
      for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
        if(this.dataEnergeticos.mes[i]["estacion"] != 'Total'){
          const element = (Number(formatNumber((this.dataEnergeticos.mes[i][this.concepto]), 'en-US', '1.0-2')))
          data.push(element);
        } 
      }
      this.serie = data;
    }

    private setTitle() {
      switch (this.concepto) {
          case 'personal':
            this.title = 'Personal';
            break;
        default:
          this.title = String(this.concepto);
          break;
      }
    }
  }
