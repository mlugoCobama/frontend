import { DatePipe } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { ResponseAgenciasNissan } from "src/app/core/models/dashboard/agencias-nissan";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { AgenciasService } from "src/app/core/services/dashboard/agencias.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: 'app-detalle-ant-inventario',
  templateUrl: './detalle-ant-inventario.component.html',
  styleUrl: './detalle-ant-inventario.component.css'
})
export class DetalleAntInventarioComponent implements OnInit {
  public concepto: string;
  public agencias:any;
  public dataAntInventario:any;
  public titulo: any;

  public isLoad: boolean = true;

  public dataEnergeticos: any;

  public meses = dataMeses;

  public mesSeleccionado: any = 0;

  public anioSeleccionado: any = 0;
  public nombreMes: any;

  private anioActual :any =new Date().getFullYear();
  private mesActual :any =  new Date().getMonth();
  public conceptos:any = [];

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageServiceService,
    public datepipe: DatePipe,
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService,
    private agenciasNissan: AgenciasService
  ) {}

  ngOnInit(): void {
    this.concepto = this.route.snapshot.paramMap.get("concepto");
    this.isLoad = false;
    this.titulo = this.concepto.replace('_',' ');
    this.recuperarLocalStorage();
  }


  public recuperarLocalStorage(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
      const fecha = new Date;
      const mes = (fecha.setMonth(fecha.getMonth() -1))
      this.mesSeleccionado = this.datepipe.transform(mes, 'MM');
      this.anioSeleccionado = this.datepipe.transform((new Date), 'yyyy');
      this. nombreMes = this.meses[Number(this.mesSeleccionado-1)]["nombre"];
      this.agencias  = (this.dataEnergeticos['mes']).map((item) => item.estacion); 
      this.dataAntInventario = this.dataEnergeticos['antInventarios'];
      this.filtrarInfo();
  }

  public filtrarInfo() {
    this.agenciasNissan
      .getAnual(
        3,
        Number(this.mesSeleccionado)+1,
        this.anioSeleccionado,
      )
      .subscribe(
        (data: ResponseAgenciasNissan) => {
          if (data.success) {
            this.localStorage.removeItem("DataEnergeticos");
            this.ordenarDatos(data);
            this.localStorage.setItem("DataEnergeticos", data.data);
            this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
            this.energerticosGaseras.actualizarData();

            const mes = this.dataEnergeticos['mes'].find((registro) => registro.planta != "Total");
            const periodo =  mes.fecha.split("-");

            this.nombreMes = this.meses[periodo[1]-1]["nombre"];
            this.mesSeleccionado = periodo[1];

          } else {
            this.alertService.alertError(data.message, data.success);
          }
        },
        (error) => {
          this.alertService.alertError(error, false);
        }
      );
  }

  /**
   * Ordena los datos de mayor a menor en base al mes
   * @param data Datos recuperados de la base de datos
   */
  public ordenarDatos(data) {
    if (data.data["mes"].length > 1) {
      const arrayMes = data.data["mes"];
      const arrayReferencia = arrayMes.map((item, index) => ({
        index,
        value: item[this.concepto],
      }));//Genera un array con index y el valor por el cual se va a ordenar

      arrayReferencia.sort((a, b) => b.value - a.value);//Ordena el array de referencia mayor a menor
      const arrayMes_ordenado = arrayReferencia.map(
        (item) => arrayMes[item.index] // ordena el array del periodo en base al array de referencia
      );
      data.data["mes"] = arrayMes_ordenado;
      if (data.data["mesAnt"].length > 1) {
        const arrayMesAnterior = data.data["mesAnt"];
        const arrayMesAnterior_ordenado = arrayReferencia.map(
          (item) => arrayMesAnterior[item.index]
        );
        data.data["mesAnt"] = arrayMesAnterior_ordenado;
      }
      if (data.data["anioAnt"].length > 1) {
        const arrayAnioAnterior = data.data["anioAnt"];
        const arrayAnioAnterior_ordenado = arrayReferencia.map(
          (item) => arrayAnioAnterior[item.index]
        );
        data.data["anioAnt"] = arrayAnioAnterior_ordenado;
      }
    }
  }

  public onChange(select: string, value: any) {
    if (select === "selectMes") {
      this.mesSeleccionado = value;
    } else {
      this.anioSeleccionado = value;
    }
  }

  public onChangeDivision(value: string) {
    // this.divisionSeleccionada = value;
    this.filtrarInfo();
  }
  

  //Deshabilita meses superiores o iguales al mes actual
  public filtrarMeses(mes: string):boolean{
    return Number(this.anioSeleccionado) === this.anioActual && Number(mes) > this.mesActual;   
  }
}

