import { Component , Input, OnInit} from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { Subject, Subscription } from "rxjs";
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-porcentajes-graficas',
  templateUrl: './porcentajes-graficas.component.html',
  styleUrls: ['./porcentajes-graficas.component.css']
})
export class PorcentajesGraficasComponent implements OnInit {
  @Input() concepto: string;

  public dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;

  public dataAnual: any = [];

  public dataAnualAnt: any = [];

  public total: number[] = [] ;
  public chart:any;
  private labels: any;
  private serie: any;

  public options = {
    series: [],
    chart: {
      width: '500',
      type: "pie"
    },
    labels: [],
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
  }

  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras : EnergeticosGaserasService
  ) {}

  ngOnInit(): void {
    this.inicializarGrfica();
    this.actualizarDatosSubscripcion =
    this.gaseras.actualizarData$.subscribe(() => {
      this.actualizarGrafica();
    });
  }

  /**
   * Inicializa los valores de las gráficas
   */
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
    this.chart = new ApexCharts(document.querySelector("#chart_participacion"), this.options);
    this.chart.render();
  }

  /** 
   * Actualiza los valores de la grafica
   */
  private actualizarGrafica(){
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
    this.chart.updateOptions(this.options)   
  }

  /**
   * Genera las series de la gráfica
   */
  private generarSerie(){
    let data:any = [];
    this.deleteLast();
    for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
      if(this.dataEnergeticos.mes[i]["entidad"] != 'Total'){
        const element = this.valueNegative(Number(formatNumber((this.dataEnergeticos.mes[i][this.concepto] / this.total[0][0][this.concepto]) * 100, 'en-US', '1.0-2')))
        data.push(element);
      } 
    }
    this.serie = data;
    console.log(this.serie);
  }

  /**
   * Manejo de valores negativos
   */
  private valueNegative( value: number ) {
    if (value < 0) {
      return value * -1;
    } else {
      return value;
    }
  }

  /**
   * Genera las etiquetas de las series de las gráficas
   */
  private generarLabels(){
    let data:any = [];
    for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
      if(this.dataEnergeticos.mes[i]["entidad"] != 'Total'){
        const element = this.dataEnergeticos?.mes[i]['entidad'];
        data.push(element);
      }
    }
    this.labels = data;
  }


  /**
   * elimina el total y lo almacena eun un nuevo arreglo
   */
  private deleteLast () { 
    this.total = [];
    for ( let item in this.dataEnergeticos ) {
      if (item == 'mes') {
        let total = this.dataEnergeticos[item].filter( data => data.entidad === 'Total');
        this.dataEnergeticos[item] = this.dataEnergeticos[item].filter( data => data.entidad !== 'Total');
        this.total.push(total);
      }     
    }   
  }
}
