import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-totales-grafica',
  templateUrl: './totales-grafica.component.html',
  styleUrls: ['./totales-grafica.component.css']
})
export class TotalesGraficaComponent {

  @Input() dataMes: any;
  @Input() dataMesAnterior: any;
  @Input() concepto: any;
  @Input() tipo: any;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  @Input() color:string;

  public title: string;

  public money: string  = '';

  public totalMes: number = 0;
  public totalMesAnt: number = 0;
  public diferencia: number = 0;

  private dataSerie: any[] = [];

  public options = {
    series: [{
      name: '',
      data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
      }],
      chart: {
          type: 'area',
          height: 240,
          sparkline: {
              enabled: true
          }
      },
      xaxis:{
       type: 'datetime'
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

  ngAfterViewInit(): void {
      
    this.setTitle();
    this.setDataSerie();

    this.totalMes = this.dataMes.find((registro) => registro.estacion === "Total");
    this.totalMesAnt = this.dataMesAnterior.find((registro) => registro.estacion === "Total");
    this.diferencia = this.totalMes[this.concepto] -  this.totalMesAnt[this.concepto];
  
    this.options.series[0]['name'] = this.title;
    this.options.series[0]['data'] = this.dataSerie;
    this.options.colors.unshift(this.color);
    var chart = new ApexCharts(document.querySelector("#chart_"+ this.concepto), this.options);
    chart.render();
  }
  
  
  setTitle() {
    switch (this.concepto) {
      case 'uno':
        this.title = 'UNO';
        this.money = '$';
        break;
      case 'utilidad_bruta':
        this.title = 'Utilidad Bruta';
        this.money = '$';
        break; 
      case 'ubo':
        this.title = 'UBO';
        this.money = '$';
        break;
      case 'eficiencia':
        this.title = 'Eficiencia';
        this.money = '%';
        break;
      case 'utilidad_nuevos':
        this.title = 'utilidad_nuevos';
        this.money = '%';
        break;
      case 'utilidad_flotilla':
        this.title = 'utilidad_flotilla';
        this.money = '$';
        break;
      default:
        this.title = this.capitalizeFirstLetter(this.concepto);
        this.money = ''
        break;
    }
  }

  private capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  private setDataSerie(){
    for (let i = 0; i < this.totalAnio.length; i++) {
      this.dataSerie.push( [new Date(this.totalAnio[i]['fecha']).getTime() , this.totalAnio[i][this.concepto] || 0] );
      // this.dataSerie.push( [new Date(this.totalAnio[i]['fecha']).getTime() , this.totalAnio[i][this.concepto] || 0] );

    }
  }
}
