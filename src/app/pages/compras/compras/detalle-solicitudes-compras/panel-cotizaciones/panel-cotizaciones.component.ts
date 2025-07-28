import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ComprasService } from "src/app/core/services/compras/compras.service";

@Component({
  selector: "app-panel-cotizaciones",
  templateUrl: "./panel-cotizaciones.component.html",
  styleUrl: "./panel-cotizaciones.component.css",
})
export class PanelCotizacionesComponent implements OnInit {
  @Input() solicitudCompra: any;

  @Output() actualizarStatus = new EventEmitter<void>();

  public formProveedoresCotizacion: FormGroup;

  public submitted: boolean = false;

  public isDisabled: boolean = false;

  public proveedores: any;

  public isLoad: boolean = true;

  // text: string = "";
  // longitudMaxima: number = 600;
  // caracteresRestantes: number = this.longitudMaxima;

  constructor(
    public formBuilder: FormBuilder,
    public proveedoresService: ProveedoresService,
    public comprasService: ComprasService,
    public alertasService: SwalComprsServiceService
  ) {}

  ngOnInit(): void {

    
    this.getProveedores();
    this.buildForm();
  }

  private buildForm() {
    this.formProveedoresCotizacion = this.formBuilder.group({
      proveedor1: new FormControl("", Validators.required),
      proveedor2: new FormControl(""),
      proveedor3: new FormControl(""),
      consideraciones: new FormControl(null),
    });
  }

  get solicitudCotizacionFormControl() {
    return this.formProveedoresCotizacion.controls;
  }

  // Recupera los registro de proveedores (ID, NOMBRE)
  private getProveedores() {
    this.proveedoresService.getProveedores().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta("Error!", response.message ?? "desconocido", "error", "danger" );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error ?? "desconocido", "error", "danger" );
      }
    );
  }

  // Guarda el registro de la cotización y llama al servicio para enviar correos
  public enviarSolicitudCotizacion() {
    this.submitted = true;
    this.isDisabled = true;

    let data = this.formProveedoresCotizacion.value;

    if (this.formProveedoresCotizacion.invalid || !this.validarProveedores(data)) {
      this.isLoad = false;

      // this.alertasService.mostrarAlerta("Algo anda mal", "Debes Selecciona la menos un proveedor", "warning",  "warning");

      this.isDisabled = false;
      return;
    }

    try {
      const idSolicitud = this.solicitudCompra.id;

      data = {
        ...data,
        solicitudes_compra_id: idSolicitud,
      };

      this.comprasService.sendMail(data).subscribe(
        (response) => {
          if (response.status === "success") {
            this.alertasService.mostrarAlerta("Listo", "Tu solicitud de cotización se ha enviado con éxito", "success",  "success");

            // this.comprasService.cambiarEstadoCotizacion(true);
            this.actualizarStatus.emit()
            this.isLoad = false;
            this.isDisabled = false;
          } else {
            this.alertasService.mostrarAlerta(response.message, "Revisa que el proveedor tenga un correo asignado", "error",  "danger");
            console.log(response.errors);
            this.isDisabled = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error!", error ?? "desconocido",  "error", "danger" );
        }
      );
      this.isLoad = false;
      this.isDisabled = false;
    } catch (error) {
      this.alertasService.mostrarAlerta("Error!", error ?? "desconocido", "error", "danger" );
    }

    this.submitted = false;
    this.formProveedoresCotizacion.reset();
  }  

  validarProveedores(data: any): boolean {
    // Verificar que al menos uno esté presente
    if (!data.proveedor1 && !data.proveedor2 && !data.proveedor3) {
      this.alertasService.mostrarAlerta(
        "Algo anda mal",
        "Debes seleccionar al menos un proveedor",
        "warning",
        "warning"
      );
      return false;
    }

    // Verificar que los proveedores seleccionados no sean iguales
    if (
      (data.proveedor1 && data.proveedor2 && data.proveedor1 === data.proveedor2) ||
      (data.proveedor2 && data.proveedor3 && data.proveedor2 === data.proveedor3) ||
      (data.proveedor1 && data.proveedor3 && data.proveedor1 === data.proveedor3)
    ) {
      this.alertasService.mostrarAlerta(
        "Algo anda mal",
        "Debes seleccionar proveedores distintos",
        "warning",
        "warning"
      );
      return false;
    }
    return true;
  }
}
