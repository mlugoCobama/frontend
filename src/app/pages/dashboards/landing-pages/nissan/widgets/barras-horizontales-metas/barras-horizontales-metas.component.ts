import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import ApexCharts from "apexcharts";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { formatNumber } from '@angular/common';


@Component({
  selector: 'app-barras-horizontales-metas',
  templateUrl: './barras-horizontales-metas.component.html',
  styleUrl: './barras-horizontales-metas.component.css'
})

export class BarrasHorizontalesMetasComponent implements AfterViewInit {
  @Input() dataMes: any[];
  @Input() dataMesAnterior: any[];
  @Input() concepto: string;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  public dataEnergeticos: any;

  public title: string;


  public diferencia: number = 0;
  public totalMes: number = 0;
  public totalMesAnt: number = 0;


  public options = {
    series: [80],
    chart: {
    height: 295,
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 100
        },
        value: {
          offsetY: 50,
          fontSize: '22px',
          color: undefined,
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
    },
  },
  stroke: {
    dashArray: 4
  },
  labels: ['Cumplimiento'],
  };

  constructor(
    private localStorage: LocalStorageServiceService,
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService
  ) { }

  ngAfterViewInit(): void {
    this.setTitle();
    this.calcularDiferencias();
    this.inicializarGrafica();
  }
  
  /**
   * Inicializa la gráfica en base a los parámetros generados
   */
  public inicializarGrafica(){
    const filaTotal =  this.dataMes.find((registro) => registro.estacion === "Total");
    const cumplimiento  =  Number(filaTotal['cumplimiento']);
    const objetivo  =  Number(filaTotal['objetivo']);
    const porcentaje = ((cumplimiento * 100)/ objetivo).toFixed(2);
    this.options.series= [Number(porcentaje)];
    var chart = new ApexCharts(document.querySelector("#chart_" + this.concepto),this.options);
    chart.render();
  }

  /**
   * Asigna un titulo en base al concepto
   */
  private setTitle() {
    switch (this.concepto) {
      case "objetivos":
        this.title = "objetivos";
        break;
      default:
        break;
    }
  }

  /**
   * Recupera el total del mes y el anterior y calcula la diferencia
   */
  public calcularDiferencias(){
    const totalesMes = this.dataMes.find((registro) => registro.estacion === "Total");
    const totalesMesAnt = this.dataMesAnterior.find((registro) => registro.estacion === "Total");

    this.totalMes = Number(formatNumber((totalesMes['cumplimiento'])*100 / totalesMes['objetivo'],'en-US', '1.0-2') );
    this.totalMesAnt = Number(formatNumber((totalesMesAnt['cumplimiento'])*100 / totalesMesAnt['objetivo'],'en-US', '1.0-2') );

    this.diferencia = Number(formatNumber((this.totalMes - this.totalMesAnt),'en-US', '1.0-2' ));
  }
}
