import { AfterViewInit, Component, Input, OnDestroy } from "@angular/core";
import ApexCharts from "apexcharts";

import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

import dataMeses from "src/environments/meses.json";
import { Subject, Subscription } from "rxjs";

/**
 * Componente que genera una gráfica de "StackBar" para la antigüedad
 * de inventarios a 6 meses en el detalle 
 * (componente actualizable)
 * @component gráfica stackBar detalle antigüedad inventario
 */
@Component({
  selector: 'app-ant-inventario',
  templateUrl: './ant-inventario.component.html',
  styleUrl: './ant-inventario.component.css'
})


export class AntInventarioComponent implements AfterViewInit, OnDestroy {
  @Input() concepto: string;
  @Input() dataAntInventario: any;
  @Input() filtro: string;

  public title: string;
  public concepto2: string;
  public money: string = "";

  private actualizarDatosSubscripcion: Subscription;
  public chart:any;

  private dataSerie: number[] = [];

  public conceptos:string[] = [];
  public meses = dataMeses;

  public datosFiltrados:any;

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
    height: 250,
    stacked: true,
    // stackType: "100%",
    toolbar:{
      show:false
    },
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
    },
    title: {
      position: 'top',
      horizontalAlign: 'center',
      text: "Ultimos 6 meses"
    },
  },
  yaxis: {
    
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
    horizontalAlign: 'center',
    offsetX: 40
  }
  };

  constructor(
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService,
    private localStorage: LocalStorageServiceService,
  ) { }

  ngAfterViewInit(): void {
    this.setTitle();
    this.inicializarGrafica();
    this.actualizarDatosSubscripcion =
    this.energerticosGaseras.actualizarData$.subscribe(() => {
      this.actualizarGrafica();
    });
  }

  ngOnDestroy(): void {
    this.actualizarDatosSubscripcion.unsubscribe();
  }

  /**
  * Inicializa la gráfica con opciones  
  */
  public inicializarGrafica(){
    
    this.options.xaxis.categories =  this.generarCategories();
    this.options.series = this.generarSeriesStack();

     this.chart = new ApexCharts(
      document.querySelector("#chart_barras_" + this.concepto +"_" +this.filtro),
      this.options
    );
     this.chart.render();
  }

  /**
  * Actualiza las series y las categorías
  */
  public actualizarGrafica(){
    // this.chart.resetSeries();
    const data = this.localStorage.getItem('DataEnergeticos');
    this.dataAntInventario =  data['antInventarios']
    this.options.xaxis.categories =  this.generarCategories();
    this.options.series = this.generarSeriesStack();
    
    this.chart.updateOptions(this.options);
  }

  /**
   * Asigna un titulo al card
   */
  private setTitle() {
    switch (this.concepto) {
      case "ant_inv_nuevo":
        this.title = "Nuevos";
        this.concepto2 = "nuevo"
        break;
      case "ant_inv_semi":
        this.title = "Seminuevos";
        this.concepto2 = "semi"
        break;
      default:
        this.title = "Antigüedad A 6 Meses";
        break;
    }
  }

  /**
   * Genera las series
   * @returns series
   */
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
    this.datosFiltrados.forEach(row => {
      series[0].data.push(row[`inv_${this.concepto2}_101`]);
      series[1].data.push(row[`inv_${this.concepto2}_201`]);
      series[2].data.push(row[`inv_${this.concepto2}_301`]);
      series[3].data.push(row[`inv_${this.concepto2}_401`]);
    });

    return series;
  }

  /**
   * Genera categorías por fechas 
   */
  public generarCategories(){
    let categorias = [];
    let fecha : any;
    let mes: any;
    let anio: any;
    this.datosFiltrados = this.dataAntInventario.filter((item) => item.estacion === this.filtro );
    this.datosFiltrados = this.datosFiltrados.reverse();
    this.datosFiltrados.forEach(row => {
      fecha = row['fecha'].split('-');
      mes = this.meses[fecha[1]-1].nombre.toUpperCase();
      anio = fecha[0]
      categorias.push(`${mes} de ${anio}`);
    });

    return categorias;
  }

}
