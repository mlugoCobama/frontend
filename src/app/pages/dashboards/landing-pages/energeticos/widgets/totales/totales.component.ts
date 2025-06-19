import { AfterViewInit, Component, Input,} from '@angular/core';

import ApexCharts from 'apexcharts';
import { ResponseEnergeticosGaseras } from 'src/app/core/models/dashboard/energeticos-gaseras';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';


@Component({
  selector: 'app-totales',
  templateUrl: './totales.component.html',
  styleUrls: ['./totales.component.css']
})
export class TotalesComponent implements AfterViewInit {

  @Input() dataMes: any[];
  @Input() dataMesAnterior: any[];
  @Input() concepto: string;
  @Input() tipo: string;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  @Input() color: string;

  public title: string;

  public money: string  = '';

  public diferencia: number = 0;
  public totalMes: number = 0;
  public totalMesAnt: number = 0;

  private dataSerie: any[] = [];

  public options = {
    series: [{
        name: '',
        data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
      }],
      chart: {
          type: 'area',
          height: 40,
          sparkline: {
              enabled: true
          }
      },
      stroke: {
          curve: 'smooth',
          width: 2,
      },
      xaxis:{
       type: 'datetime'
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
        style: {
        fontSize: '12px',
        fontFamily: undefined
        },
          fixed: {
          enabled: false,
          position: 'topRight',
          offsetX: 10,
          offsetY: 10,
         },
          x: {
               formatter:  function(value){
                 const fecha =  new Date(value)
               return fecha.toLocaleDateString('es-ES', {month : 'short', year : 'numeric'});
              }
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
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService
  ) {}
  
  ngAfterViewInit(): void {
    
    this.setTitle();
    this.setDataSerie();
    // console.log(this.dataMes);
    
    this.totalMes = this.dataMes.find((registro) => registro.estacion === "Total");
    this.totalMesAnt = this.dataMesAnterior.find((registro) => registro.estacion === "Total");
    this.diferencia = this.totalMes[this.concepto] - this.totalMesAnt[this.concepto];

    this.options.series[0]['name'] = this.title;
    this.options.series[0]['data'] = this.dataSerie;
    this.options.colors.unshift(this.color);
    var chart = new ApexCharts(document.querySelector("#chart_"+ this.concepto), this.options);
    chart.render();
  }

  private setTitle() {
    switch (this.concepto) {
      case 'ventas':
        this.title = 'Ventas';
        this.money = '$';
        break;
        case 'ventas':
          this.title = 'Ventas';
          this.money = '$';
          break;
        case 'uno':
          this.title = 'UNO';
          this.money = '$';
          break;
        case 'personal':
          this.title = 'Personal';
          this.money = '$';
          break;
      case 'venta_litros':
        this.title = 'Ventas Litros';
        break;
      case 'gasto':
        this.title = 'Gastos';
        this.money = '$';
        break;
      default:
        break;
    }
  }

  private setDataSerie(){
    for (let i = 0; i < this.totalAnio.length; i++) {
      // this.dataSerie.push( this.totalAnio[i][this.concepto] );
      this.dataSerie.push( [new Date(this.totalAnio[i]['fecha']).getTime() , this.totalAnio[i][this.concepto] || 0] );
    }
  }
}
