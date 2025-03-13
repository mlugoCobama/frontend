import { Component, Input, OnInit } from '@angular/core';
import {
   FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";

import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";


@Component({
  selector: 'app-form-cotizacion',
  templateUrl: './form-cotizacion.component.html',
  styleUrls: ['./form-cotizacion.component.css']
})
export class FormCotizacionComponent implements OnInit{

  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;
  public formSolicitudCotizacion: FormGroup;
  public proveedores: any;
  public data: any;
  @Input() solicitudCompra: any;
  public detalles: any;
  public proveedorSelec: any;
  public correosProv: any;
  public proveedoresSeleccionados: any[] = [];
  public isDisabled: boolean = false;
  public isLoad: boolean = true;
  public submitted: boolean = false;

   constructor(
    public comprasService: ComprasService,
    private cotizacionesService: CotizacionesService,
    private proveedoresService: ProveedoresService,
    public formBuilder: FormBuilder
   ) {}

   ngOnInit(): void {
     this.buildForm();
     this.getProveedores();
   }

   private buildForm(){
    this.formSolicitudCotizacion = this.formBuilder.group({
      empresa1: new FormControl(null, Validators.required),
      empresa2: new FormControl(null, Validators.required),
      empresa3: new FormControl(null, Validators.required),
      consideraciones: new FormControl(null),
    });
   }

   get solicitudCotizacionFormControl() {
    return this.formSolicitudCotizacion.controls;
  }

    // Recupera los contenidos de los selects
    onSelectChange(selectedId: string, index: number) {
      // obtiene el objeto por medio del id y lo agrega al array
      const selectedItem = this.proveedores.find(
        (item) => item.id === +selectedId
      );
      if (selectedItem) {
        this.proveedoresSeleccionados[index] = selectedItem;
      }
    }

      //Recupera todos los registros de los proveedores
  private getProveedores() {
    this.proveedoresService.getAll().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;

          const opcionPredeterminada = {
            id: null,
            nombre: "Seleccione uno",
            contacto: null,
            telefono: null,
            localidad: null,
            condiciones: null,
            servicios: null,
            correo: null,
            horario_atencion: null,
            tiempo_entrega: null,
            dias_credito: 0,
            activo: 1,
          };

          this.proveedores.unshift(opcionPredeterminada);

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

  public contarCaracteres() {
    // Valida la longitud de los text area
    this.caracteresRestantes = this.longitudMaxima - this.text.length;
  }

    //Envía la solicitud de cotización a los proveedores
    public async enviarSolicitudCotizacion() {
      this.submitted = true;
      this.isDisabled = true;
      if (this.formSolicitudCotizacion.invalid) {
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
  
      this.correosProv = this.formSolicitudCotizacion.value;
      if (
        this.correosProv.empresa1 === this.correosProv.empresa2 ||
        this.correosProv.empresa2 === this.correosProv.empresa3 ||
        this.correosProv.empresa1 === this.correosProv.empresa3
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
        const detalles = await this.getDetalle();
        const idSolicitud = this.solicitudCompra.id;
        const folioCo = await this.generarFolioCo();
        const proveedores = this.proveedoresSeleccionados;
        const consideraciones = this.correosProv.consideraciones;
        this.data = {
          proveedores:proveedores,
          detalles,
          fecha: this.fecha(),
          solicitudes_compra_id: idSolicitud,
          folioCo,
          consideraciones,
        };
  
        this.comprasService.sendMail(this.data).subscribe(
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
              // this.mostrarCotizacionFlag = false;
              this.isLoad = false;
              this.isDisabled = false;
              this.solicitudCompra.estatus = 2;
              // this.getDetalle();
            } else {
              Swal.fire({
                title: response.message,
                text: 'Revisa que el proveedor tenga un correo asignado',
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
      } catch (error) {
        console.error("Error obteniendo detalles:", error);
      }
  
      this.submitted = false;
      this.formSolicitudCotizacion.reset();
    }

      //Genera el folio de las cotizaciones
  private async generarFolioCo(): Promise<string> {
    const response = await this.cotizacionesService.obtenerFolio().toPromise();
    return response.nuevoFolio;
  }

  public fecha() {
    // Método para asignar una fecha
    // obtener la fecha en el formato correcto para la bd
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    const dia = ("0" + fecha.getDate()).slice(-2);
    const horas = ("0" + fecha.getHours()).slice(-2);
    const minutos = ("0" + fecha.getMinutes()).slice(-2);
    const segundos = ("0" + fecha.getSeconds()).slice(-2);
    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }
    
  private getDetalle(): Promise<any> {
    //Recupera el detalle y agrega columnas a la tabla
    return new Promise((resolve, reject) => {
      this.comprasService.getOne(this.solicitudCompra.id).subscribe(
        (response) => {
          if (response) {
            this.detalles = response.data;
            resolve(this.detalles);
            this.isLoad = false;
          } else {
            console.log(response.message);
            reject(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
          reject(error);
        }
      );
    });
  }
}
