import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import Swal from "sweetalert2";

@Component({
  selector: "app-tbl-fls-cotizacion",
  templateUrl: "./tbl-fls-cotizacion.component.html",
  styleUrls: ["./tbl-fls-cotizacion.component.css"],
})
export class TblFlsCotizacionComponent implements OnInit {
  @Input() solicitudCompra: any;
  @Input() cotProv: any[] = [];
  @Input() ordenCompra: any;
  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;

  public formOrdenCompra: FormGroup;
  @Input() mostrarObs: boolean = false;
  public selectedFiles: { [key: number]: File } = {};
  public proveedorSelec: any;

  @Output() savePrices = new EventEmitter<void>();
  @Output() selectCotizacion = new EventEmitter<object>();

  constructor(
    private proveedoresService: ProveedoresService,
    private ordenesComprasService: OrdenesCompraService,
    private cotizacionesService: CotizacionesService,
    private comprasService: ComprasService,
    public formBuilder: FormBuilder
  ) { this.buildForm();
    this.cotizacionesService.setForm(this.formOrdenCompra);}

  public ngOnInit(): void {
    if (
      this.solicitudCompra.estatus === 3 ||
      this.solicitudCompra.estatus === 4 ||
      this.solicitudCompra.estatus > 5
    ) {
      this.getOrdenCompra();
    }
    
    this.buildForm();
  }

  guardarPrecios() {
    this.savePrices.emit();
  }

  manejoCheck(prov: any) {
    this.selectCotizacion.emit(prov);
  }

  onFileChange1(event: Event, proveedorId: number) {
    //Recupera los archivos de los input file de la tabla proveedores
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[proveedorId] = input.files[0];
    }
  }

  onFileChange(event: Event, proveedorId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cotizacionesService.setSelectedFile(proveedorId, input.files[0]);
    }
  }

  verArchivos(prov: any) {
    //llama el service para abrir el archivo
    this.proveedoresService.abrirArchivo(prov);
  }

  private buildForm() {
    this.formOrdenCompra = this.formBuilder.group({
      observaciones: new FormControl(null, Validators.required),
    });
  }

  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }

  public contarCaracteres() {
    // Valida la longitud de los text area
    this.caracteresRestantes = this.longitudMaxima - this.text.length;
  }

  public cancelarOrden() {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "La orden será cancelada",
      icon: "error",
      confirmButtonText: " SI ",
      showCancelButton: true,
      cancelButtonText: " NO ",
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.ordenesComprasService.destroy(this.solicitudCompra.id).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.message);
              Swal.fire({
                title: "Cancelada!",
                text: "La orden ha sido cancelada.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 5;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }
      // this.isLoad = false;
    });
  }

  public autorizarOrden() {
    const data = {
      idSolicituCompra: this.solicitudCompra.id,
      idOrdenCompra: this.ordenCompra.id,
    };
    Swal.fire({
      title: "Ya casi!!",
      text: "Deseas enviar la solicitud de surtido al proveedor?",
      icon: "info",
      showDenyButton: true,
      confirmButtonText: " SI ",
      denyButtonText: `NO`,
      customClass: {
        confirmButton: "btn btn-success px-4",
        denyButton: "btn btn-danger ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenesComprasService.enviarSolicitudSurtido(data).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.data);
              Swal.fire({
                title: "Enviada!!",
                text: "La orden de compra ha sido autorizada y enviada al proveedor.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 6;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      } else if (result.isDenied) {
        this.ordenesComprasService.autorizarOrdenCompra(data).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.data);
              Swal.fire({
                title: "Orden autorizada!!",
                text: "La orden sera marcada como autorizada",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 4;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }
      // this.isLoad = false;
    });
  }

  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}
