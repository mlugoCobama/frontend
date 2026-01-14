import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import dataMeses from "src/environments/meses.json";
import { SortDatos } from "src/app/core/helpers/sort-datos";

@Component({
  selector: "app-detalle-energeticos",
  templateUrl: "./detalle-energeticos.component.html",
  styleUrls: ["./detalle-energeticos.component.css"],
})
export class DetalleEnergeticosComponent implements OnInit {
  public concepto: string;

  public titulo: any;

  public isLoad: boolean = true;

  public dataEnergeticos: any;

  public meses = dataMeses;

  public mesSeleccionado: any = 0;

  public anioSeleccionado: any = 0;
  public nombreMes: any;

  private anioActual :any =new Date().getFullYear();
  private mesActual :any =  new Date().getMonth();

  private divisionSeleccionada: string = "all";

  public tipo:any = "energeticos";

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

            SortDatos.ordenarDatos(data, this.concepto);
            
            this.localStorage.setItem("DataEnergeticos", data.data);
            this.dataEnergeticos = this.localStorage.getItem("DataEnergeticos");
            this.energerticosGaseras.actualizarData();

            const mes = this.dataEnergeticos['mes'].find((registro) => registro.id != "Total");
            const periodo =  mes.fecha.split("-")
            this.nombreMes = this.meses[periodo[1]-1]["nombre"];
            this.mesSeleccionado = periodo[1];
            this.anioSeleccionado = periodo[2];

          } else {
            this.alertService.alertError(data.message, data.success);
            this.energerticosGaseras.actualizarData();
            const mes = this.dataEnergeticos['mes'].find((registro) => registro.id != "Total");
            const periodo =  mes.fecha.split("-")
            this.nombreMes = this.meses[periodo[1]-1]["nombre"];
            this.mesSeleccionado = periodo[1];
            this.anioSeleccionado = periodo[2];
          }
        },
        (error) => {
          this.alertService.alertError(error, false);
        }
      );
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
