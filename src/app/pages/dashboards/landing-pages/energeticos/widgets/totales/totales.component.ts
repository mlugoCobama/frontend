import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

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
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;

  public title: string;

  public money: string  = '';

  public diferencia: number = 0;

  private dataSerie: number[] = [];

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

  constructor(
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService
  ) {}
  
  ngAfterViewInit(): void {
    
    this.setTitle();
    this.setDataSerie();
    this.diferencia = this.dataMes[16][this.concepto] - this.dataMesAnterior[16][this.concepto];

    this.options.series[0]['name'] = this.title;
    this.options.series[0]['data'] = this.dataSerie;

    var chart = new ApexCharts(document.querySelector("#chart_"+ this.concepto), this.options);
    chart.render();
  }

  private setTitle() {
    switch (this.concepto) {
      case 'ventas':
        this.title = 'Ventas';
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
      this.dataSerie.push( this.totalAnio[i][this.concepto] );
    }
  }

}
