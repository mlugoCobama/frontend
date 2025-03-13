import { Component, OnInit, NgModule } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalComprasComponent } from "./modal-compras/modal-compras.component";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";

@Component({
  selector: "app-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.css"],
})
export class ComprasComponent implements OnInit {
  public dtOptions: Config = {};
  
  public modalRef?: BsModalRef;
  
  public showTable: boolean = false;
  public solicitudSelecionada: boolean = false;
  public isLoad: boolean = true;
  mostrarBoton = false;

  public solicitudCompra: any; // Objeto que envió al componente detallesSolicitudCompra
  public status: any;
  public data: any;
  public unidades: any;

  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    public ordenesComprasService: OrdenesCompraService,
    public comprasService: ComprasService,
    private modalService: BsModalService
  ) {}

  public ngOnInit(): void {
    this.comprasService.mostrarBoton$.subscribe((mostrar) => {
      this.mostrarBoton = mostrar;
    });

    this.dtOptions = environment.dataTables;
    this.getAll();
    this.getUnidades();
  }


  /**
   * Manejo de componentes
   */
  
  public openModalNuevo() {
    const initialState: ModalOptions = {
      initialState: {
        unidades: this.unidades,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalComprasComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
  }

  public openDetallesSolicitud(dato: any, evento: any) {
    // Funcion para llenar la vista con el detalle component
    this.solicitudSelecionada = true;
    // Verifica si hay un elemento seleccionado (evento del doble click)
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.solicitudSelecionada = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");

      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
      this.solicitudSelecionada = true;
      this.solicitudCompra = dato; // Castea el objeto que se envia al detalleSolicitudCompra
      this.status = this.solicitudCompra.estatus;
    }
  }

  /**
   * Consultas generales
   */
  public solictado: any = 1;
  public enCotizacion: any = 2;
  public enOrdenCompra: any = 3;
  public autorizada: any = 4;
  public cancelada: any = 5;
  public enSurtido: any = 6;
  public pagada: any = 7;

  private getAll() {
    this.comprasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.data.forEach((registro: any) => {
            registro.fecha = new Date(registro.fecha).toLocaleString();
            switch (registro.estatus) {
              case this.solictado:
                registro.estado = "SOLICITADO";
                registro.claseEstado = "bg-primary";
                break;

              case this.enCotizacion:
                registro.estado = "EN COTIZACIÓN";
                registro.claseEstado = "bg-info";
                break;

              case this.enOrdenCompra:
                registro.estado = "ORDEN DE COMPRA";
                registro.claseEstado = "bg-warning";
                break;

              case this.autorizada:
                registro.estado = "AUTORIZADA";

                registro.claseEstado = "badge-soft-success";
                break;

              case this.cancelada:
                registro.estado = "CANCELADA";
                registro.claseEstado = "bg-danger";
                break;

              case this.enSurtido:
                registro.estado = "EN SURTIDO";
                registro.claseEstado = "badge-soft-warning";
                break;

              case this.pagada:
                registro.estado = "PAGADA";
                registro.claseEstado = "bg-success";
                break;

              default:
                registro.estado = "DESCONOCIDO";
                registro.claseEstado = "badge-soft-dark";
                break;
            }
          });

          this.isLoad = false;
          this.showTable = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidades = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
  
  /**
   * Funciones Botonera
   */

  public regresar() {
    // Muestra la vista de la tabla
    this.comprasService.cambiarEstadoCotizacion(false);
    this.solicitudSelecionada = false;
    this.status = 0;
    this.mostrarBoton = false;
    this.getAll();
  }

  mostrarCotizacion() {
    this.comprasService.cambiarEstadoCotizacion(true);
  }

  public cancelarSolicitud() {
    this.isLoad = true;
    Swal.fire({
      title: "¿Estas seguro?",
      text: "La solicitud será marcada como cancelada",
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
        this.comprasService.destroy(this.solicitudCompra.id).subscribe(
          (response) => {
            if (response.status === "success") {
              this.getAll();
              Swal.fire({
                title: "Cancelada!",
                text: "La solicitud ha sido cancelada.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            } else {
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
      this.isLoad = false;
    });
  }

  btnGenerarOC() {
    this.comprasService.triggerGenerateOrder();
  }

  btnDescargarOC() {
    this.ordenesComprasService
      .pdfOrdenCompra(this.solicitudCompra.id)
      .subscribe((response) => {
        if (response) {
          const blob = new Blob([response], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "orden_compra.pdf";
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          Swal.fire({
            title: "Error!",
            text: "La orden de compra no existe",
            buttonsStyling: false,
            icon: "error",
            customClass: {
              confirmButton: "btn btn-danger px-4",
              cancelButton: "btn btn- ms-2 px-4",
            },
          });
        }
      });
  }
}
