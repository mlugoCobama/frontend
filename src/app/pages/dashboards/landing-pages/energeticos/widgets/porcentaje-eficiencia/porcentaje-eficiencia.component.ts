import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-porcentaje-eficiencia',
  templateUrl: './porcentaje-eficiencia.component.html',
  styleUrl: './porcentaje-eficiencia.component.css'
})
export class PorcentajeEficienciaComponent implements OnInit {
  @Input() dataMes: any;
  @Input() dataMesAnterior: any;
  @Input() concepto: any;
  @Input() tipo: any;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  @Input() color:string;

  public promedioMes:any;
  public promedioMesAnt:any;
  public diferencia:any;

  ngOnInit(): void {
    this.incicializarGrafica();
  }

  public options =  {
          colors:['#f1b44c'],
          series: [76],
          chart: {
          type: 'radialBar',
          offsetY: -10,
          sparkline: {
            enabled: true
          }
        },
        plotOptions: {
          radialBar: {
            startAngle: -120,
            endAngle: 120,
            track: {
              background: "",
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#444',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                show: true
              },
              value: {
                offsetY: 5,
                fontSize: '22px'
              }
            }
          }
        },
        grid: {
          padding: {
            top: 0
          }
        },
         fill: {

           type: 'gradient',
           gradient: {
             shade: 'light',
             shadeIntensity: 0.4,
             inverseColors: false,
             opacityFrom: 1,
             opacityTo: 1,
             stops: [0, 50, 53, 91]
           },
         },
        labels: ['Eficiencia'],
        };

  incicializarGrafica(){
    this.promedioMes = this.calcularSerie(this.dataMes);
    this.promedioMesAnt = this.calcularSerie(this.dataMesAnterior);
    this.diferencia = this.promedioMes - this.promedioMesAnt
    this.options.series = [Number( this.promedioMes)]

    var chart = new ApexCharts(document.querySelector("#chart"), this.options);
        chart.render();
  }

  calcularSerie(data){
    let serie  = [];
    let total;
    data.forEach(dato => {
      if(dato.entidad != 'Total'){
        serie.push(dato[this.concepto]);
            }
      else{
        total = dato[this.concepto]
      }
    });
    
    let promedio =  (Number(total) / serie.length) * 10;
    return promedio.toFixed(2);
  }
}
