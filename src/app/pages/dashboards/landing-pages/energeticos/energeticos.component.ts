import { Component, OnInit } from "@angular/core";

import { AlertErrorService } from "src/app/core/services/alert-error.service";

import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";

import { DatePipe } from "@angular/common";
import dataMeses from "src/environments/meses.json";
import { trigger, transition, animate, style} from "@angular/animations";

@Component({
  selector: "app-energeticos",
  templateUrl: "./energeticos.component.html",
  styleUrls: ["./energeticos.component.css"],
  animations: [trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
  ]),
])],
})
export class EnergeticosComponent implements OnInit {
  public dataMesActual: any;

  public dataMesAnterior: any;

  public dataMesAnioAnterior: any;

  public dataTotalAnio: any;

  public dataTotalAnioAnt: any;

  public isLoad: boolean = true;

  public meses = dataMeses;

  public actState: boolean = false;
  

  constructor(
    public alertService: AlertErrorService,
    public datepipe: DatePipe,
    private energerticosGaseras: EnergeticosGaserasService,
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    this.getDataAnual();
  }

  public nombreMes: any;
  public anioActual: any;
  public fecha:any = new Date();   

  // Recupera los datos en base a la fecha actual
  private getDataAnual() {
      // let fecha = new Date();
      // this.fecha.setMonth(this.fecha.getMonth()-1);
      let mes = this.fecha.getMonth();
      let anio = this.datepipe.transform(this.fecha, "y");
      this.consultarDatos((mes+1), anio);
      // this.nombreMes = this.meses[Number(mes)]["nombre"];
      // this.anioActual = anio;
  }

  /**
   * Recupera los datos a consultar y los coloca en el local storage
   * Si hay datos para el mes almacena en el local storage 
   * Si no hay datos busca de nuevo y resta un mes
   * @param mes 
   * @param anio 
   */
  consultarDatos(mes, anio){
    this.energerticosGaseras.getAnual(1, mes, anio, "all").subscribe(
      (data: ResponseEnergeticosGaseras) => {
        if (data.success) {
          this.dataMesActual = data.data["mes"];
          this.dataMesAnterior = data.data["mesAnt"];
          this.dataMesAnioAnterior = data.data["anioAnt"];
          this.dataTotalAnio = data.data["totalAnio"];
          this.dataTotalAnioAnt = data.data["totalAnioAnt"];
          this.isLoad = false;
          this.localStorage.setItem("DataEnergeticos", data.data);

          const mes = this.dataMesActual.find((registro) => registro.id != "Total");
          const periodo =  mes.fecha.split("-")
          this.nombreMes = this.meses[periodo[1]-1]["nombre"];
          this.anioActual = periodo[2];
          this.alertService.alertError(data.message, data.success);
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }
}
