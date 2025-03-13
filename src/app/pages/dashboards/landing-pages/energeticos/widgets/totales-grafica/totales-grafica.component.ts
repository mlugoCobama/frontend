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
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;

  public title: string;

  public money: string  = '';

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
          }
      }
  }

  ngAfterViewInit(): void {
      
    this.setTitle();
    this.setDataSerie();
    this.diferencia = this.dataMes[15][this.concepto] - this.dataMesAnterior[15][this.concepto];
  
    this.options.series[0]['name'] = this.title;
    this.options.series[0]['data'] = this.dataSerie;
  
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
        break;
        
      default:
        break;
    }
  }

  private setDataSerie(){
    for (let i = 0; i < this.totalAnio.length; i++) {
      this.dataSerie.push( this.totalAnio[i][this.concepto] );
    }
  }
}
