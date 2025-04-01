import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: "app-detalle-energeticos",
  templateUrl: "./detalle-energeticos.component.html",
  styleUrls: ["./detalle-energeticos.component.css"],
})
export class DetalleEnergeticosComponent implements OnInit {
  public concepto: string;

  public isLoad: boolean = true;

  public dataEnergeticos: any;

  public meses = dataMeses;

  public mesSeleccionado: any = 0;

  public anioSeleccionado: any = 0;
  public nombreMes: any;

  private anioActual :any =new Date().getFullYear();
  private mesActual :any =  new Date().getMonth();

  private divisionSeleccionada: string = "all";

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageServiceService,
    public datepipe: DatePipe,
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService
  ) {}

  ngOnInit(): void {
    this.concepto = this.route.snapshot.paramMap.get("concepto");
    this.isLoad = false;

    this.recuperarLocalStorage();
  }

  public recuperarLocalStorage(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
      const fecha = new Date;
      const mes = (fecha.setMonth(fecha.getMonth() -1))
      this.mesSeleccionado = this.datepipe.transform(mes, 'MM');
      this.anioSeleccionado = this.datepipe.transform((new Date), 'yyyy');
      this. nombreMes = this.meses[Number(this.mesSeleccionado-1)]["nombre"];
      this.filtrarInfo();
  }

  public filtrarInfo() {
    this.energerticosGaseras
      .getAnual(
        1,
        Number(this.mesSeleccionado)+1,
        this.anioSeleccionado,
        this.divisionSeleccionada
      )
      .subscribe(
        (data: ResponseEnergeticosGaseras) => {
          if (data.success) {
            this.localStorage.removeItem("DataEnergeticos");

            this.ordenarDatos(data);
            this.localStorage.setItem("DataEnergeticos", data.data);
            this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
            this.energerticosGaseras.actualizarData();

            const mes = this.dataEnergeticos['mes'].find((registro) => registro.id != "Total");
            const periodo =  mes.fecha.split("-")
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
    this.divisionSeleccionada = value;
    this.filtrarInfo();
  }
  

  //Deshabilita meses superiores o iguales al mes actual
  public filtrarMeses(mes: string):boolean{
    return Number(this.anioSeleccionado) === this.anioActual && Number(mes) > this.mesActual;   
  }


}
