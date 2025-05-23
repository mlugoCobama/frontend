import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-totales-utilidad-grafica',
  templateUrl: './totales-utilidad-grafica.component.html',
  styleUrl: './totales-utilidad-grafica.component.css'
})

/**
 * Componente que genera un card  con gráfica de "Area" para mostrar venta y utilidad
 * por un conjunto de conceptos en base a un concepto clave
 * (componente no actualizable)
 * @component gráfica totales utilidad dashboard
 */
export class TotalesUtilidadGraficaComponent implements AfterViewInit {

  @Input() dataMes: any[];
  @Input() dataMesAnterior: any[];
  @Input() concepto: string;
  @Input() tipo: string;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  @Input() color: string;

  public title: string;

  public money: string  = '';
  public concepto2: string;
  public diferencia: number = 0;
  public totalMes: number = 0;
  public totalMesAnt: number = 0;

  public diferencia1: number = 0;
  public totalMes1: number = 0;
  public totalMesAnt1: number = 0;

  private dataSerie: number[] = [];
  private dataSerie1: number[] = [];
  public options = {
    series: [{
        name: '',
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
    }

    ],
      chart: {
          type: 'area',
          height: 40,
          stacked: true,
          sparkline: {
              enabled: true
          }
      },
      stroke: {
          curve: 'smooth',
          width: 2,
      },
      colors: ['#f1b44c'],
      fill: {
          type: 'gradient',
          gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.45,
              opacityTo: 0.05,
              stops: [25, 100, 100, 100]
          },
      },
      
      tooltip: {
          fixed: {
              enabled: false
          },
          x: {
              show: false
          },
          marker: {
              show: false
          },
          y: {
            formatter:  function(value){
              return value.toLocaleString('en-US');
            }
          }
      }
  }

  constructor(
  ) {}
  
  ngAfterViewInit(): void {
    
    this.setTitle();
    this.setDataSerie();
    this.setDataSerie1();
    
    this.totalMes = this.dataMes.find((registro) => registro.estacion === "Total");
    this.totalMesAnt = this.dataMesAnterior.find((registro) => registro.estacion === "Total");
    this.diferencia = this.totalMes[this.concepto] - this.totalMesAnt[this.concepto];
    this.concepto2 = `utilidad_${this.concepto}`
    this.diferencia1 = this.totalMes[this.concepto2] - this.totalMesAnt[this.concepto2];

    this.options.series[0]['name'] = 'Utilidad Bruta';
    this.options.series[0]['data'] = this.dataSerie1;

    this.options.colors.unshift(this.color);
    var chart = new ApexCharts(document.querySelector("#chart_"+ this.concepto), this.options);
    chart.render();
  }

  /**
   * Asigna un titulo al card en base a su concepto
   */
  private setTitle() {
    switch (this.concepto) {
        case 'nuevos':
          this.title = 'Nuevos';
          this.money = '$';
          break;
        case 'seminuevos':
          this.title = 'Semi Nuevos';
          this.money = '$';
          break;
        case 'flotillas':
          this.title = 'Flotillas';
          this.money = '$';
          break;
        case 'servicio':
          this.title = 'Ordenes de servicio';
          this.money = '$';
          break;
        case 'hyp':
          this.title = 'Ordenes de HyP';
          this.money = '$';
          break;
      default:
        break;
    }
  }

  /**
   * Genera una serie en base a los datos del año y de ventas
   */
  private setDataSerie(){
  for (let i = 0; i < this.totalAnio.length; i++) {
        this.dataSerie.push( this.totalAnio[i][this.concepto] ); 
     }
  }
 /**
   * Genera una serie en base a los datos del año y de utilidad
   */
  private setDataSerie1(){
    for (let i = 0; i < this.totalAnio.length; i++) {
          this.dataSerie1.push( this.totalAnio[i][`utilidad_${this.concepto}`] );
       }
    }
}
