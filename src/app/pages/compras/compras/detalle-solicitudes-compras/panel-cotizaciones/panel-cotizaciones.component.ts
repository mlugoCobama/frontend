import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
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

  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;

  constructor(
    public formBuilder: FormBuilder,
    public proveedoresService: ProveedoresService,
    public comprasService: ComprasService
  ) {}

  ngOnInit(): void {

    
    this.getProveedores();
    this.buildForm();
  }

  private buildForm() {
    this.formProveedoresCotizacion = this.formBuilder.group({
      proveedor1: new FormControl(null, Validators.required),
      proveedor2: new FormControl(null, Validators.required),
      proveedor3: new FormControl(null, Validators.required),
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
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  // Valida la longitud de los text area
  public contarCaracteres() {
    this.caracteresRestantes = this.longitudMaxima - this.text.length;
  }

  // Guarda el registro de la cotización y llama al servicio para enviar correos
  public enviarSolicitudCotizacion() {
    this.submitted = true;
    this.isDisabled = true;
    if (this.formProveedoresCotizacion.invalid) {
      this.isLoad = false;
      Swal.fire({
        title: "Algo anda mal",
        text: "Debes llenar correctamente todos los campos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      this.isDisabled = false;
      return;
    }

    let data = this.formProveedoresCotizacion.value;

    if (
      data.proveedor1 === data.proveedor2 || data.proveedor2 === data.proveedor3 || data.proveedor1 === data.proveedor3
    ) {
      Swal.fire({
        title: "Algo anda mal",
        text: "Debes de seleccionar proveedores distintos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
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
            Swal.fire({
              title: "Enviado",
              text: "Tu solicitud de cotización se ha enviado correctamente",
              buttonsStyling: false,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            
            // this.comprasService.cambiarEstadoCotizacion(true);

            this.actualizarStatus.emit()
            this.isLoad = false;
            this.isDisabled = false;
          } else {
            Swal.fire({
              title: response.message,
              text: "Revisa que el proveedor tenga un correo asignado",
              buttonsStyling: false,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            console.log(response.errors);
            this.isDisabled = false;
          }
        },
        (error) => {
          console.error("Error enviando datos:", error);
        }
      );
      this.isLoad = false;
      this.isDisabled = false;
    } catch (error) {
      console.error("Error obteniendo detalles:", error);
    }

    this.submitted = false;
    this.formProveedoresCotizacion.reset();
  }  
}
