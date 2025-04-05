import { Component , Input, OnInit, AfterViewInit} from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { Subject, Subscription } from "rxjs";
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-totales-porcentaje-grafica',
  templateUrl: './totales-porcentaje-grafica.component.html',
  styleUrl: './totales-porcentaje-grafica.component.css'
})
export class TotalesPorcentajeGraficaComponent implements AfterViewInit{

  @Input() concepto: string;

public dataEnergeticos: any;

private actualizarDatosSubscripcion: Subscription;

public dataAnual: any = [];

public dataAnualAnt: any = [];

public total: number;
public total2: string = "0";
private labels: any;
private serie: any;
public title: any;

public totalMes: number = 0;
public totalMesAnt: number = 0;
public diferencia: number = 0;

public conceptos: any = [];

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
              fontWeight: 600,
              fontSize: '22px',
            },
            value: {
              // show: true,
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
    legend: {
      // position: "bottom"
      // show: false
    },
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
    this.getDiferencias();
  }


  private inicializarGrfica(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    if(this.dataEnergeticos.mes.length > 1){
    // this.getTotalesSeries();
    this.options.labels = this.getLabelsConceptos();
    this.options.series = this.getSeriesConceptos();
    
    }else{
      this.options.series = [100];
      this.options.labels = ['Sin datos'];
    }
      this.chart = new ApexCharts(document.querySelector(`#chart_${this.concepto}`), this.options);
      this.chart.render();
    }

    private valueNegative( value: number ) {
      if (value < 0) {
        return value * -1;
      } else {
        return value;
      }
    }

    public getTotalesSeries(){
      let totales:any = [];
      let serie:any = [];
      let filaTotales = this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
      this.conceptos.forEach( concepto => {
        const value = Number(filaTotales[concepto]);
        totales.push(value);
      });
      let totalConceptos =  totales.reduce((a, b) => {
        return a + b
      }, 0)
      console.log(totales)
      console.log(totalConceptos);
      totales.forEach(totalConcepto => {
        const element = this.valueNegative(Number(formatNumber((totalConcepto / totalConceptos) * 100, 'en-US', '1.0-2')))
        serie.push(element);
      });
      this.serie = serie;
      this.labels = this.conceptos;
      console.log(serie);
    }

    public getSumaConcepto(){
      let totales = this.getData().map((item) => item.value);
      let totalConceptos =  totales.reduce((a, b) => {
        return a + b
      }, 0);
      return totalConceptos;
    }

    public getSeriesConceptos(){
      let serie = [];
      const data =  this.getData();
      const total =  this.getSumaConcepto();

      data.forEach(totalConcepto => {
        // const element = this.valueNegative(Number(formatNumber((totalConcepto.value / total) * 100, 'en-US', '1.0-2')))
        const element =this.valueNegative(Number(totalConcepto.value))

        serie.push(element);
      });

      return serie;
    }

    public getLabelsConceptos(){
      let labels = this.getData().map((item) => item.key.replace(/_/g, " ").toUpperCase())
      return labels;
    }

    getData(){
      let totales:any = [];
      let filaTotales = this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
      this.conceptos.forEach( concepto => {
        const key = concepto;
        const value = Number(filaTotales[concepto]);
        totales.push({key, value});
      });
      return totales;
    }

    getDiferencias(){
      let totales:any = [];
      let totalesMA:any = [];
      let filaTotales = this.dataEnergeticos.mes.find((registro) => registro.estacion === "Total");
      let filaTotalesMA = this.dataEnergeticos.mesAnt.find((registro) => registro.estacion === "Total");
      this.conceptos.forEach( concepto => {
        const value = Number(filaTotales[concepto]);
        const valueMA = Number(filaTotalesMA[concepto]);
        totales.push( value);
        totalesMA.push(valueMA);
      });

      this.totalMes = totales.reduce((a, b) => {return a + b}, 0);
      this.totalMesAnt = totalesMA.reduce((a, b) => {return a + b}, 0);
      this.diferencia = this.totalMes - this.totalMesAnt;


    }

    private setTitle() {
      switch (this.concepto) {
          case 'total_ventas_ref':
            this.title = 'Ventas de post venta';
            this.conceptos = ['ventas_servicio', 'refacciones_mostrador','refacciones_hyp','refacciones_servicio'];
            break;
          case 'inventarios':
            this.title = 'Inventarios';
            this.conceptos = ['inventario_nuevos', 'inventario_refacciones','inventario_seminuevos'];
            break;
          case 'utilidad_area':
            this.title = 'Utilidad por area';
            this.conceptos = ['area_postventa', 'area_comercial'];
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
