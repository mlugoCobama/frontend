import { Component, OnInit } from "@angular/core";

import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { ResponseAgenciasNissan } from "src/app/core/models/dashboard/agencias-nissan";
import { AgenciasService } from "src/app/core/services/dashboard/agencias.service";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { EnergeticosGasolinerasService } from "src/app/core/services/dashboard/energeticos-gasolineras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";

import { DatePipe } from "@angular/common";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: 'app-nissan',
  templateUrl: './nissan.component.html',
  styleUrl: './nissan.component.css'
})
export class NissanComponent implements OnInit {
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
    private agencias: AgenciasService,
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    this.getDataAnual();
  }

  

  // Recupera los datos en base a la fecha actual
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
    this.agencias.getAnual().subscribe(
      (data: ResponseAgenciasNissan) => {
        if (data.success) {
          this.dataMesActual = data.data["mes"];
            console.log('mes');
            console.table(this.dataMesActual);
          this.dataMesAnterior = data.data["mesAnt"];
            console.log('mesAnt');
            console.table(this.dataMesAnterior);
          this.dataMesAnioAnterior = data.data["anioAnt"];
            console.log('mesAnioAnterior');
            console.table(this.dataMesAnioAnterior);
          this.dataTotalAnio = data.data["totalAnio"];
            console.log('totalAnio');
            console.table(this.dataTotalAnio);
          this.dataTotalAnioAnt = data.data["totalAnioAnt"];
            console.log('totalAnioAnt');
            console.table(this.dataTotalAnioAnt);
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
