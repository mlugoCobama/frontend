import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";

import ApexCharts from "apexcharts";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: 'app-stack-grafica',
  templateUrl: './stack-grafica.component.html',
  styleUrl: './stack-grafica.component.css'
})
export class StackGraficaComponent implements AfterViewInit {
  @Input() dataMes: any[];
  @Input() dataMesAnterior: any[];
  @Input() concepto: string;
  public concepto2: string;
  @Input() tipo: string;
  @Input() totalAnio: string;
  @Input() totalAnioAnt: string;
  @Input() color: string;
  @Input() dataAntInventario: any;
  public title: string;

  public money: string = "";

  public diferencia: number = 0;
  public totalMes: number = 0;
  public totalMesAnt: number = 0;

  
  public diferencia1: number = 0;
  public totalMes1: number = 0;
  public totalMesAnt1: number = 0;

  private dataSerie: number[] = [];
  private dataSerie1: number[] = [];

  public conceptos:string[] = [];
  public meses = dataMeses;

  public options = {
    series: [{
    name: '101-200',
    data: [44, 55]
  }, {
    name: '201-300',
    data: [53, 32]
  }, {
    name: '301-400',
    data: [12, 17]
  }, {
    name: '401 y Mas',
    data: [9, 7]
  }],
    chart: {
    type: 'bar',
    height: 260,
    stacked: true,
    stackType: "100%"
  },
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        total: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: '12px',
            fontWeight: 500
          },
          formatter: function (val) {
            return val 
          }
        }
      }
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  xaxis: {
    categories: ['Nuevos', 'Seminuevos'],
    labels: {
      formatter: function (val) {
        return val 
      }
    }
  },
  yaxis: {
    title: {
      text: undefined
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val 
      }
    }
  },
  fill: {
    opacity: 1
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetX: 40
  }
  };

  constructor(
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService
  ) { }

  ngAfterViewInit(): void {
    this.setTitle();
    this.generarSeriesStack();
    const filaTotales = this.dataMesAnterior.find((registro) => registro.estacion === "Total");
    console.log(filaTotales)
    this.options.series = this.generarSeriesStack();
    this.options.xaxis.categories =  this.generarCategories();
      // [{
      //   name: '101-200',
      //   data: [Number(filaTotales['inv_nuevo_101']), Number(filaTotales['inv_semi_101'])]
      // }, {
      //   name: '201-300',
      //   data: [Number(filaTotales['inv_nuevo_201']), Number(filaTotales['inv_semi_201'])]
      // }, {
      //   name: '301-400',
      //   data: [Number(filaTotales['inv_nuevo_301']), Number(filaTotales['inv_semi_301'])]
      // }, {
      //   name: '401 y Mas',
      //   data: [Number(filaTotales['inv_nuevo_401']), Number(filaTotales['inv_semi_401'])]
      // }]
      //  console.log(this.options.series);
    
    this.generarSeriesStack();
    var chart = new ApexCharts(
      document.querySelector("#chart_barras_" + this.concepto),
      this.options
    );
    chart.render();
  }

  private setTitle() {
    switch (this.concepto) {
      case "ant_inv_nuevo":
        this.title = "Antigüedad Inventarios Nuevos";
        this.concepto2 = "nuevo"
        break;
      case "ant_inv_semi":
        this.title = "Antigüedad Inventarios Seminuevos";
        this.concepto2 = "semi"
        break;
      default:
        this.title = "Antigüedad A 6 Meses";
        break;
    }
  }

  public generarSeriesStack(){
    let series = [
      {
        name: '101-200',
        data:[]
      },
      {
        name: '201-300',
        data:[]
      },
      {
        name: '301-400',
        data:[]
      },
      {
        name: '400 y mas',
        data:[]
      }
    ]
    this.dataAntInventario.forEach(row => {
      series[0].data.push(row[`inv_${this.concepto2}_101`]);
      series[1].data.push(row[`inv_${this.concepto2}_201`]);
      series[2].data.push(row[`inv_${this.concepto2}_301`]);
      series[3].data.push(row[`inv_${this.concepto2}_401`]);
    });

    return series;
  }

  public generarCategories(){
    let categorias = [];
    let fecha : any;
    let mes: any;
    let anio: any;
    this.dataAntInventario.forEach(row => {
      fecha =row['fecha'].split('-');
      mes = this.meses[fecha[1]-1].nombre.toUpperCase();
      anio = fecha[0]
      categorias.push(`${mes} de ${anio}`);
    });

    return categorias;
  }

  private setDataSerie() {
    for (let i = 0; i < this.totalAnio.length; i++) {
      this.dataSerie.push(this.totalAnio[i][this.concepto2]);
    }
  }
}
