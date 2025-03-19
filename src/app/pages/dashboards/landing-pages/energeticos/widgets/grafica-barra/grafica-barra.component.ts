import { Component, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grafica-barra',
  templateUrl: './grafica-barra.component.html',
  styleUrl: './grafica-barra.component.css'
})
export class GraficaBarraComponent {

  @Input() concepto: string;
  
    private dataEnergeticos: any;
  
    private actualizarDatosSubscripcion: Subscription;
  
    public dataAnual: any = [];
  
    public dataAnualAnt: any = [];

    Highcharts: typeof Highcharts = Highcharts;
      chartOptions: Highcharts.Options = {
        title: {
          text: 'Anual'
        },
        xAxis: {
          categories: [
              'Servigas del Valle', 
              'Gas Urbano', 
              'Gas Multiregional', 
              'Gasamex',
              'Reyes Gas',
              'Iztagas y Energia',
              'Flamamex',
              'Azteca Gas',
              'Satelite Gas',
              'Garza Gas',
              'Garza Sur',
              'Segas',
              'Zugas',
              'Gas Premio'
          ],
          title: {
            text: null
          },
          gridLineWidth: 1,
          lineWidth: 0
        },
        yAxis: {
          title: {
              text: 'Miles de Pesos'
          }
        },
        tooltip: {
          shared: true,
        },
        plotOptions: {
          line: {
              dataLabels: {
                  enabled: true
              },
              enableMouseTracking: true
          }
        },
        series: [
          {
            name: '2025',
            data: [16.0, 18.2, 23.1, 27.9, 32.2, 36.4, -39.8, 38.4,-35.5, 29.2,22.0, 17.8, 25.6],
            type: 'bar',
          }
        ]
      };

}
