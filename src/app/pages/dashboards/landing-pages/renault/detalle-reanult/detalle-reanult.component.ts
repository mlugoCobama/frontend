import { DatePipe } from "@angular/common";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseAgenciasNissan } from "src/app/core/models/dashboard/agencias-nissan";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { AgenciasRenaultService } from "src/app/core/services/dashboard/agencias-renault.service";
import { EnergeticosGaserasService } from "src/app/core/services/dashboard/energeticos-gaseras.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SortDatos } from "src/app/core/helpers/sort-datos";
import dataMeses from "src/environments/meses.json";

@Component({
  selector: 'app-detalle-reanult',
  templateUrl: './detalle-reanult.component.html',
  styleUrl: './detalle-reanult.component.css'
})
export class DetalleReanultComponent implements OnInit {
  public concepto: string;

  public titulo: any;

  public isLoad: boolean = true;
  public tipo:any =  "autos";

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
    private agencias: AgenciasRenaultService
  ) {}

  ngOnInit(): void {
    this.concepto = this.route.snapshot.paramMap.get("concepto");
    this.subConceptos(this.concepto);
    this.isLoad = false;
    this.titulo = this.concepto.replace(/_/g, " ");
    this.recuperarLocalStorage();
  }

  public arrAgencias:any;
  public dataAntInventario:any;
  
  public recuperarLocalStorage(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
      const fecha = new Date;
      const mes = (fecha.setMonth(fecha.getMonth() -1))
      this.mesSeleccionado = this.datepipe.transform(mes, 'MM');
      this.anioSeleccionado = this.datepipe.transform((new Date), 'yyyy');
      this. nombreMes = this.meses[Number(this.mesSeleccionado-1)]["nombre"];
      this.arrAgencias  = (this.dataEnergeticos['mes']).map((item) => item.estacion); 
      this.dataAntInventario = this.dataEnergeticos['antInventarios'];
      this.filtrarInfo();
  }

  public filtrarInfo() {
    this.agencias
      .getAnual(
        4,
        Number(this.mesSeleccionado)+1,
        this.anioSeleccionado,
      )
      .subscribe(
        (data: ResponseAgenciasNissan) => {
          if (data.success) {
            this.localStorage.removeItem("DataEnergeticos");

            SortDatos.ordenarDatos(data, this.concepto);
          
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

  /**
   * Genera un array para cada tipo de concepto
   * @param concepto concepto dado por la grafica
   */
  public subConceptos(concepto){
    switch (concepto) {
      case "nuevos":
        this.conceptos = ['nuevos', 'utilidad_nuevos']
        break;
      case "seminuevos":
        this.conceptos = ['seminuevos', 'utilidad_seminuevos']
        break;
      case "flotillas":
        this.conceptos = ['flotillas', 'utilidad_flotillas']
        break;
      case "servicio":
        this.conceptos = ['servicio', 'utilidad_servicio']
        break;
      case "hyp":
        this.conceptos = ['hyp', 'utilidad_hyp']
        break;
      case "inventarios":
        this.conceptos = ['inventario_nuevos', 'inventario_seminuevos', "inventario_refacciones"]
        break; 
      case "utilidad_area":
        this.conceptos = ['area_comercial', 'area_postventa']
        break;
      case "objetivos":
        this.conceptos = ['objetivo', 'cumplimiento']
        break;
      case "nrf":
        this.conceptos = ['nrf', 'nrf_interes']
        break;
      case "plan_piso":
        this.conceptos = ['plan_piso', 'plan_piso_interes']
        break;
      case "costos_financieros":
        this.conceptos = ['costo_nuevos', 'costo_flotillas', "refacciones", "bajio"]
        break;
      case "ventas_postventa":
        this.conceptos = ['ventas_servicio', 'refacciones_servicio', "refacciones_hyp", "refacciones_mostrador"]
        break; 
      default:
        this.conceptos = [this.concepto];
        break;
    }
  }

}

