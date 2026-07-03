import { Component, OnInit } from '@angular/core';
import { DispersionesDieselService } from 'src/app/core/services/compras/dispersiones-diesel.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: "app-dispersiones",
  templateUrl: "./dispersiones.component.html",
  styleUrl: "./dispersiones.component.css",
})
export class DispersionesComponent implements OnInit {
  
  constructor(
    private dispersiones: DispersionesDieselService,
    private alertasService: SwalComprsServiceService,
  ) {}

  ngOnInit(): void {
    this.getDisperiones();
  }

  tabActiva: 'pendientes' | 'guardadas' | 'realizadas' = 'pendientes';

  public fechaInicio = '';
  public fechaFin = '';

  pendientes = [];
  realizadas = [];
  guardadas = [];

  pendientesOriginal = [];
  guardadasOriginal = [];
  realizadasOriginal = [];

  public mostrar: boolean = false;
  public dispersion: any;
  public loading: boolean = false;
  //Recupera los datos del elemento seleccionado
  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.dispersion = dato;

    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
    this.getDetalleDispersion();
  }

  public volver() {
    this.dispersion = null;
    this.getDisperiones();
  }

  private getDisperiones() {
    this.loading = true;
    this.dispersiones.getAll().subscribe(
      (response) => {
        if (response) {
          this.pendientesOriginal = response.data.pendientes;
          this.guardadasOriginal = response.data.guardadas;
          this.realizadasOriginal = response.data.realizadas;

          this.pendientes = [...this.pendientesOriginal];
          this.guardadas = [...this.guardadasOriginal];
          this.realizadas = [...this.realizadasOriginal];
          this.loading = false;
        } else {
          this.loading = false;
          this.alertasService.mostrarAlerta("Error", response.message, "error","danger");
        }
      },
      (error) => {
        this.loading = false;
        this.alertasService.mostrarAlerta( "Error", `Error fetching data: ${error}`, "error", "danger");
      },
    );
  }

  public dataDispersion: any = [];
  public loadingDispersion: boolean = false;

  public getDetalleDispersion() {
    this.loadingDispersion = true;
    this.dataDispersion = [];
    this.dispersiones.getOne(this.dispersion.id).subscribe(
      (response) => {
        if (response) {
          this.loadingDispersion = false;
          this.dataDispersion = response.data;
          // console.log(this.dataDispersion);
        } else {
          this.loadingDispersion = false;
          this.alertasService.mostrarAlerta( "Error", response.message, "error", "danger",);
        }
      },
      (error) => {
        this.loadingDispersion = false;
        this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error", "danger",);
      },
    );
  }

  filtrarPorFechas(): void {
    this.pendientes = this.pendientesOriginal.filter(
      (x:any) => this.estaEnRango(x.fecha)
    );
    this.guardadas = this.guardadasOriginal.filter(
      (x:any) => this.estaEnRango(x.fecha_dispersion)
    );
    this.realizadas = this.realizadasOriginal.filter(
      (x:any) => this.estaEnRango(x.fecha_dispersion)
    );
  }

  private estaEnRango(fechaRegistro: string): boolean {

    if (!fechaRegistro) {
      return false;
    }
    const fecha = new Date(fechaRegistro);
    const inicio = this.fechaInicio
      ? new Date(`${this.fechaInicio}T00:00:00`)
      : null;
    const fin = this.fechaFin
      ? new Date(`${this.fechaFin}T23:59:59`)
      : null;
    if (inicio && fecha < inicio) {
      return false;
    }
    if (fin && fecha > fin) {
      return false;
    }
    return true;
  }

  limpiarFiltros(): void {

    this.fechaInicio = '';
    this.fechaFin = '';

    this.pendientes = [...this.pendientesOriginal];
    this.guardadas = [...this.guardadasOriginal];
    this.realizadas = [...this.realizadasOriginal];
  }
}