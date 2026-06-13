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

  tabActiva: "pendientes" | "realizadas" = "pendientes";

  pendientes = [];
  realizadas = [];

  procesar(item: any): void {
    console.log(item);
  }

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
          this.pendientes = response.data.pendientes;
          this.realizadas = response.data.realizadas;
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
}