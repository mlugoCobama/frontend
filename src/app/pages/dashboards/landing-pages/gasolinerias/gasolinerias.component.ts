import { Component, OnInit } from "@angular/core";

import { AlertErrorService } from "src/app/core/services/alert-error.service";

import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { EnergeticosGasolinerasService } from "src/app/core/services/dashboard/energeticos-gasolineras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";

import { DatePipe } from "@angular/common";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: 'app-gasolinerias',
  templateUrl: './gasolinerias.component.html',
  styleUrl: './gasolinerias.component.css'
})
export class GasolineriasComponent implements OnInit {
  public dataMesActual: any;

  public dataMesAnterior: any;

  public dataMesAnioAnterior: any;

  public dataTotalAnio: any;

  public dataTotalAnioAnt: any;

  public isLoad: boolean = true;

  public meses = dataMeses;

  public nombreMes: any;

  public anioActual: any;

  public fecha:any = new Date(); 

  constructor(
    public alertService: AlertErrorService,
    public datepipe: DatePipe,
    private energerticosGasolinerias: EnergeticosGasolinerasService,
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    this.getDataAnual();
  }

  

  /**
   * Recupera los datos en base a la fecha actual
   */ 
  private getDataAnual() {
      let mes = this.fecha.getMonth();
      let anio = this.datepipe.transform(this.fecha, "y");
      
      this.consultarDatos((mes + 1), anio);
  }

  /**
   * Recupera los datos a consultar y los coloca en el local storage
   * @param mes 
   * @param anio 
   */
  consultarDatos(mes: any, anio: any){
    this.energerticosGasolinerias.getAnualGasolinerias(2, mes, anio).subscribe(  
      (data: ResponseEnergeticosGaseras) => {
        if (data.success) {
          this.dataMesActual = data.data["mes"];
          this.dataMesAnterior = data.data["mesAnt"];
          this.dataMesAnioAnterior = data.data["anioAnt"];
          this.dataTotalAnio = data.data["totalAnio"];
          this.dataTotalAnioAnt = data.data["totalAnioAnt"];
          this.isLoad = false;
          this.localStorage.setItem("DataEnergeticos", data.data);
          this.alertService.alertError(data.message, data.success);
          const mes = this.dataMesActual.find((registro) => registro.id != "Total");
          const periodo =  mes.fecha.split("-")
          this.nombreMes = this.meses[periodo[1]-1]["nombre"];
          this.anioActual = periodo[2];
          
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
