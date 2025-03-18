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

  public options = {
    series: [],
    chart: {
      width: 500,
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

  public chart:any;
  private inicializarGrfica(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    if(this.dataEnergeticos.mes.length > 1){
    this.generarLabels();
    this.generarSerie()
    this.options.series = this.serie;
    this.options.labels = this.labels;
    
    }else{
      this.options.series = [100];
      this.options.labels = ['Sin datos'];
    }
    this.chart = new ApexCharts(document.querySelector("#chart_participacion"), this.options);
    this.chart.render();
    // console.groupCollapsed(this.dataEnergeticos);
  }

  private actualizarGrafica(){
    // var chart = 
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
    // chartrender();
    this.chart.updateOptions(this.options)
  
  }

  private serie: any;
  private generarSerie(){
    let data:any = [];
    for (let i = 0; i < this.dataEnergeticos.mes.length-1; i++) {
      // const element = this.dataEnergeticos.totalAnioAnt[i][this.concepto];
      const element = Number(formatNumber((this.dataEnergeticos.mes[i][this.concepto] / this.dataEnergeticos.mes[this.dataEnergeticos.mes.length-1][this.concepto]) * 100, 'en-US', '1.0-2'))
      data.push(element);
    }
    this.serie = data;
  }
  private labels: any;
  private generarLabels(){
    let data:any = [];
    for (let i = 0; i < this.dataEnergeticos.mes.length-1; i++) {
      const element = this.dataEnergeticos.anioAnt[i]['entidad'];
      data.push(element);
    }
    this.labels = data;
  }
}
