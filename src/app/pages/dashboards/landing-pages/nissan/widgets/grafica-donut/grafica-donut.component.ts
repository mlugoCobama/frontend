import { Component , Input, OnInit, AfterViewInit} from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { Subject, Subscription } from "rxjs";
import { formatNumber } from '@angular/common';



@Component({
  selector: 'app-grafica-donut',
  templateUrl: './grafica-donut.component.html',
  styleUrl: './grafica-donut.component.css'
})

export class GraficaDonutComponent implements AfterViewInit{

  @Input() concepto: string;

  public dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public totalMes: number;
  public totalMesAnt: number;
  public diferencia:number;

  public total2: string = "0";
  private labels: any;
  private serie: any;
  public title: any;

  public chart:any;
  public options = {
    series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                // show: true,
                fontWeight: 600,
                fontSize: '22px',
              },
              value: {
                show: true,
                fontSize: '16px',
                formatter: function (val) {
                  return Number(val).toLocaleString()
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontWeight: 550,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0).toLocaleString();
                }
              }
            }
          },      
        }
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      // legend: {
      //   position: "bottom"
      // },
      tooltip: {
        y: {
          formatter:  function(value){
            return value.toLocaleString('en-US');
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    constructor(
      private localStorage: LocalStorageServiceService,
      private gaseras : EnergeticosGaserasService
    ) {}

    ngAfterViewInit(): void {
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
        this.chart = new ApexCharts(document.querySelector("#chart_dona_"+this.concepto), this.options);
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
        // this.deleteLast();
         
        let total =  this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
        this.totalMes =total[this.concepto];
        
        let totalMA =  this.dataEnergeticos.mesAnt.find((registro) => registro.estacion === "Total");
        this.totalMesAnt =totalMA[this.concepto];

        this.diferencia = this.totalMes - this.totalMesAnt

        for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
          if(this.dataEnergeticos.mes[i]["estacion"] != 'Total'){
            const element = this.valueNegative(Number(((this.dataEnergeticos.mes[i][this.concepto]))))
            // const element = this.valueNegative(Number(formatNumber((this.dataEnergeticos.mes[i][this.concepto] / this.total) * 100, 'en-US', '1.0-2')))
            data.push(element);
          } 
        }
        this.serie = data;
        console.log(this.serie);
      }
  
      public getTotal(){
        let total = this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
        return String(total[this.concepto]) || "0";
      }

      private setTitle() {
        switch (this.concepto) {
            case 'ventas_servicio':
              this.title = 'Ventas Servicio';
              break;
            case 'gasto':
              this.title = 'Gastos';
              break;
              case 'personal':
               this.title = 'Personal';
              break;
              case 'bono_marca':
               this.title = 'Bonos Marcas';
              break;
            case 'servicio':
              this.title = 'Servicio';
              break;
            case 'hyp':
              this.title = 'HyP';
              break;
          default:
            break;
        }
      }
  }


