import { Component, OnInit, NgModule } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalComprasComponent } from "./modal-compras/modal-compras.component";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";


//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
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
  public mostrarBoton = false;

  public solicitudCompra: any; // Objeto que envió al componente detallesSolicitudCompra
  public status: any;
  public data: any;

  constructor(
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
  }
  /**
   * Manejo de componentes
   */
  public openModalNuevo() {
    const initialState: ModalOptions = {
      initialState: {
        //Datos que envió al componente
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
  // Funcion para llenar la vista con el detalle component
  public openDetallesSolicitud(dato: any, evento: any) {
    this.solicitudSelecionada = true;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.solicitudSelecionada = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
      this.solicitudSelecionada = true;
      this.solicitudCompra = dato; // Objeto que se envía al detalleSolicitudCompra
      this.status = this.solicitudCompra.estatus;
    }
  }

  //Recupera todos los registros de solicitudes de compras
  private getAll() {
    this.comprasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
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

  /**
   * Funciones Botonera
   */
  // Muestra la vista de la tabla
  public regresar() {
    this.comprasService.cambiarEstadoCotizacion(false);
    this.solicitudSelecionada = false;
    this.status = 0;
    this.mostrarBoton = false;
    this.getAll();
  }
  //Muestra u oculta el panel de cotizaciones
  mostrarCotizacion() {
    this.comprasService.cambiarEstadoCotizacion(true);
    this.status = this.solicitudCompra.estatus;
  }

  // Cancela la solicitud desde un botón en la botonera
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

  //Botón que genera la orden  de compra
  btnGenerarOC() {
    this.comprasService.triggerGenerateOrder();
  }

  //Botón que descarga la orden de compra
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

  updateStatus(status:any){
    this.status = status;
  }

  /**
   * Fin funciones Botonera
   */
}
