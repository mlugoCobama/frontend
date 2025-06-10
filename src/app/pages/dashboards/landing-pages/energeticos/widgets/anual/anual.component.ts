import { Component, Input, OnInit, AfterViewInit, OnDestroy} from "@angular/core";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { Subject, Subscription } from "rxjs";

import * as Highcharts from "highcharts";

@Component({
  selector: "app-anual",
  templateUrl: "./anual.component.html",
  styleUrls: ["./anual.component.css"],
})
export class AnualComponent implements OnInit, OnDestroy{
  @Input() concepto: string;
  @Input() titulo: string;

  private dataEnergeticos: any;

  private actualizarDatosSubscripcion: Subscription;
  public dataAnual: any = [];
  public dataAnualAnt: any = [];
  public dataAnualAnt2: any = [];

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    chart:{
      zooming: {
            type: 'x',
        },
    },
  title: {
    text: "Anual",
  },
  xAxis: {
    categories: [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ],
  },
  yAxis: {
    title: {
      text: "Miles de Pesos",
    },
    plotLines: [
      {
        color: '#7F8CAA',
        width: 2,
        value: 0
      }
    ],
  },
  //INICIA: Modifica el formato del tooltip
  tooltip: {
    shared: true,
    formatter: function (this:any) {
      const meses =[
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ]
      const points = this.points ?? [];
      let tooltip = `${meses[this.x]}<br/>`;
      // Muestrar todas las series disponibles (aunque algunas tengan null)
      points.forEach(p => {
        tooltip += `<span style="color: ${p.series.color};">●</span> ${p.series.name}: <b>${Number(p.y).toLocaleString() ?? 'N/D'}</b><br/>`;
      });

      // Valida que existan do series para realizar la comparación
      const validPoints = points.filter(p => typeof p.y === 'number') as typeof points;
      
      if (validPoints.length >= 2) {
        tooltip += `<br/><b>Diferencia periodos:</b><br/>`;
        for (let i = 0; i < validPoints.length - 1; i++) {
          const name1 = validPoints[i].series.name;
          const name2 = validPoints[i + 1].series.name;
          const y1 = validPoints[i].y as number;
          const y2 = validPoints[i + 1].y as number;
          const diff = y1 - y2;

          let color = 'black';
          if(diff > 0) color = '#16C47F';
          else if(diff < 0) color =  '#FB4141';

          tooltip += `${name1}-${name2}: <b style="color:${color}">${Number(diff.toFixed(2)).toLocaleString()}</b><br/>`
        }
      }
      return tooltip;
    }
  },
  //TERMINA: Modifica el formato del tooltip
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      enableMouseTracking: true,
    },
  },
  series: [
    {
      name: "2025",
      data: [
        16.0, 18.2, 23.1, 27.9, 32.2, 36.4,
        39.8, 38.4, 35.5, 29.2, 22.0, 17.8
      ],
      type: "line",
    },
    {
      name: "2024",
      data: [
        -2.9, -3.6, -0.6, 4.8, 10.2, 14.5,
        17.6, 16.5, 12.0, 6.5, 2.0, -0.9
      ],
      type: "line",
    },
  ],
};
  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService
  ) {}

   ngOnInit(): void {
  this.inicializarGrfica();
   this.actualizarDatosSubscripcion = this.gaseras.actualizarData$.subscribe(
       () => {
         this.inicializarGrfica();
       }
     );
   }
   ngOnDestroy(): void {
     this.actualizarDatosSubscripcion.unsubscribe();
   }


  public chart: any;
  private inicializarGrfica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    // const prediccion2 = this.seriePrediccion(this.dataAnual);

    let serie = [ this.dataAnual, this.dataAnualAnt, this.dataAnualAnt2];
    this.chartOptions.series = serie;
    this.chartOptions.title.text =  `Anual: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

  private actualizarGrafica() {
    this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
    this.serieAnio();
    this.serieAnioAnt();
    this.serieAnioAnt2();
    // const prediccion2 = this.seriePrediccion(this.dataAnual);
    let serie = [this.dataAnual, this.dataAnualAnt, this.dataAnualAnt2];
    this.chartOptions.series = serie;
    this.chartOptions.title.text =  `Anual: ${this.formatearTexto(this.concepto)} - ${this.setTitle()}`
    this.updateFlag = true;
  }

  
  public setTitle(){

    switch (this.dataEnergeticos.totalAnio[0].estacion) {
      case undefined:
        return 'Total';
        break;
      case 'Planta':
        return this.dataEnergeticos.totalAnio[0].entidad
        break;
      default:
        return this.dataEnergeticos.totalAnio[0].estacion
        break;
    }
  }

  /**
   * Retira del texto "_" y pone la primer letra en mayúscula
   * @param texto String a formatear
   * @returns "texto_ejemplo" a "Texto ejemplo"
   */
  public formatearTexto(texto){
    const capitalCaseText= String(texto).charAt(0).toUpperCase() + String(texto).slice(1);
    let textoFormateado = capitalCaseText.replace("_", " ")
    return textoFormateado;
  }

  /**
   * Genera la serie en base a los datos del año dado
   * @param datos Data anual del año a recuperar
   * @returns array [[datetime, dato]...] o array [ ] 
   */
  private generarSerie(datos: any[], nombreVariable: string) {
  let data: number[] = [];

  if (datos.length > 0) {
    for (let i = 0; i < datos.length; i++) {
        const element = Number(
          datos[i][this.concepto]
        );
        data.push(element);
      }
    return {
      name: String(new Date(datos[0]["fecha"]).getFullYear()),
      data: data,
      type: "line",
    };
  } else {
    return {
      name: "sin datos",
      data: data,
      type: "line",
    };
  }
}


 /**
   * Genera la serie a partir de año actual o mas reciente,
   * asigna le resultado a "dataAnual"
   */
private serieAnio() {
  this.dataAnual = this.generarSerie(this.dataEnergeticos.totalAnio, "dataAnual");
}

/**
   * Genera la serie a partir de año anterior ,
   * asigna el resultado a "dataAnualAnt"
   */
private serieAnioAnt() {
  this.dataAnualAnt = this.generarSerie(this.dataEnergeticos.totalAnioAnt, "dataAnualAnt");
}

/**
  * Genera la serie a partir de año anterior - 1 ,
  * asigna el resultado a "dataAnualAnt2"
  */
private serieAnioAnt2() {
  this.dataAnualAnt2 = this.generarSerie(this.dataEnergeticos.totalAnioAnt2, "dataAnualAnt2");
}

    private seriePrediccion(data) {
    const datos = [...this.dataAnualAnt.data, ...data.data];
    let serie;
    const prediccion = this.predecirRestantes(datos);

    const mesesExcluidos = data.data.map(() => null);
    let seriePrediccion = [];
    if(mesesExcluidos.length <= 12){
      seriePrediccion = mesesExcluidos.concat(prediccion.slice(mesesExcluidos.length-12, prediccion.length));
    }else{
      seriePrediccion = prediccion;
    }
    
    serie = {
      name: `Tendencia ${data.name}`,
      type: "line",
      data: seriePrediccion,
      dashStyle: "ShortDash",
      color: "#f39c12",
      marker: {
        enabled: false,
        
      },
      dataLabels: {
            enabled: false
        }
    };
    return serie;
  }

  predecirRestantes( totales: number[], inicioMes = 1 ,totalMeses = 24): number[] {
    const n = totales.length;
    const x = Array.from({ length: n }, (_, i) => i + inicioMes);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = totales.reduce((a, b) => a + b, 0);
    const sumXY = totales.reduce((acc, y, i) => acc + y * x[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    const b = (sumY - m * sumX) / n;

    const predicciones: number[] = [];
    for (let i = n + inicioMes; i <= totalMeses; i++) {
      predicciones.push(Math.round(m * i + b));
    }
    return predicciones;
  }
}
