import { Component, OnInit, NgModule, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalComprasComponent } from "./modal-compras/modal-compras.component";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";
import { EstadoSolicitud } from "./estado-solicitud.enum";
import { FuncionesTablas } from "./funciones-tablas";
import catCentrosCostos from "src/environments/cat_centros_costos.json";
//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";

import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";

@Component({
  selector: "app-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.css"],
})
export class ComprasComponent implements OnInit {
  public dtOptions: Config = {};

  public modalRef?: BsModalRef;

  public modalAbierto: boolean = false;
  public showTable: boolean = false;
  public solicitudSelecionada: boolean = false;
  public isLoad: boolean = true;
  public mostrarBoton = false;
  public habilitarDescarga = false;
  public modifica: boolean = false;

  public centrosCostos: any = catCentrosCostos;
  public empresas: any = [];
  public rawEmpresas: any = [];
  public usuarioSolicita: any;

  /**
   * Objeto que envió al componente detallesSolicitudCompra
   */
  public solicitudCompra: any;
  public status: any;
  public data: any;
  public enEsts = EstadoSolicitud;

  // varibles funciones tablas
  datosFiltrados: any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda: string = "";
  busqueda2: string = "";

  constructor(
    public ordenesComprasService: OrdenesCompraService,
    public alertasService: SwalComprsServiceService,
    public comprasService: ComprasService,
    private modalService: BsModalService,
    private localStorage: LocalStorageServiceService,
    private usuariosService: UsuariosService
  ) {}

  public ngOnInit(): void {
    this.comprasService.mostrarBoton$.subscribe((mostrar) => {
      this.mostrarBoton = mostrar;
    });

    this.getEmpresas();
    
  }

  ngOnDestroy(): void {}

    /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          this.rawEmpresas = response.data;
          this.getUsuarioActivo();
          console.log(response.data)
          // this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            response.message,
            "error",
            "danger"
          );
          console.log(response.message);
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
        // console.error("Error fetching data:", error);
      }
    );
  }

  //Recupera todos los registros de solicitudes de compras
  private getAll(intercompania) {
    this.isLoad = true;
    this.comprasService
      .getAll(intercompania, this.usuarioSolicita?.id)
      .subscribe(
        (response) => {
          if (response) {
            this.data = response.data;
            this.modifica =
              response.tipo == "compras" || response.tipo == "RT"
                ? true
                : false;
            this.ordenador = new FuncionesTablas(this.data);
            this.datosFiltrados = [...this.data];

            this.isLoad = false;
            this.showTable = true;
          } else {
            this.alertasService.mostrarAlerta(
              "Error!",
              response.message,
              "error",
              "danger"
            );
            console.log(response.message);
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
          console.error("Error fetching data:", error);
        }
      );
  }

  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");
    this.usuarioSolicita = usuarioActivo["usuarioActivo"][0];
    if (this.usuarioSolicita?.empresas != null) {
      this.filtrarEmpresas(this.rawEmpresas, this.usuarioSolicita?.empresas);
    }
    this.getAll(this.usuarioSolicita?.intercompania);
  }

  filtrarEmpresas(data, empRel) {
    this.empresas = data.filter((empresa) =>
      empRel.includes(empresa.intercompania)
    );
  }

  /**
   * Manejo de componentes
   */
  public openModalNuevo() {
    this.modalAbierto = true;
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
      this.getAll(this.usuarioSolicita.intercompania);
    });
    this.modalRef.content.modalCerrado.subscribe(() => {
      this.modalAbierto = false;
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

  /**
   * Funciones Botonera
   */
  // Muestra la vista de la tabla
  public regresar() {
    this.comprasService.cambiarEstadoCotizacion(false);
    this.solicitudSelecionada = false;
    this.status = null;
    this.mostrarBoton = false;
    this.getAll(this.usuarioSolicita.intercompania);
  }
  //Muestra u oculta el panel de cotizaciones
  mostrarCotizacion() {
    this.comprasService.cambiarEstadoCotizacion(true);
    this.status = this.solicitudCompra.estatus;
  }

  // Cancela la solicitud desde un botón en la botonera
  public cancelarSolicitud1() {
    this.isLoad = true;
    Swal.fire({
      title: "¿Estas seguro?",
      text: "La solicitud será marcada como cancelada",
      input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },


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
              this.regresar();
              this.alertasService.mostrarAlerta(
                "Cancelada!",
                "La solicitud ha sido cancelada.",
                "success",
                "success"
              );
            } else {
              this.alertasService.mostrarAlerta(
                "Error!",
                "Ocurrió un error inesperado",
                "error",
                "error"
              );
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta(
              "Error!",
              error,
              "error",
              "error"
            );
          }
        );
      }
      this.isLoad = false;
    });
  }
  public cancelarSolicitud() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'La solicitud será marcada como cancelada. Por favor ingresa la razón:',
    input: 'textarea',
    inputAttributes: {
      autocapitalize: 'off'
    },
    icon: 'warning',
    confirmButtonText: 'Sí, cancelar',
    showCancelButton: true,
    cancelButtonText: 'No',
    customClass: {
      confirmButton: 'btn btn-danger px-4',
      cancelButton: 'btn btn-primary ms-2 px-4',
    },
    buttonsStyling: false,
    preConfirm: (razon) => {
      if (!razon || razon.trim() === '') {
        Swal.showValidationMessage('Debes ingresar una razón válida');
        return false;
      }
      return razon;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      this.isLoad = true;

      const payload = {
        id: this.solicitudCompra.id,
        razonCancelacion: result.value
      };

      this.comprasService.destroy(payload).subscribe(
        (response) => {
          this.isLoad = false;
          if (response.status === 'success') {
            this.regresar();
            this.alertasService.mostrarAlerta(
              'Cancelada!',
              'La solicitud ha sido cancelada.',
              'success',
              'success'
            );
          } else {
            this.alertasService.mostrarAlerta(
              'Error!',
              'Ocurrió un error inesperado',
              'error',
              'error'
            );
          }
        },
        (error) => {
          this.isLoad = false;
          this.alertasService.mostrarAlerta(
            'Error!',
            error,
            'error',
            'error'
          );
        }
      );
    }
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
      .subscribe(
        (response) => {
          if (response) {
            const blob = new Blob([response], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "orden_compra.pdf";
            link.click();
            window.URL.revokeObjectURL(url);
            // this.alertasService.mostrarAlerta("Descargando", "Revisa el apartado de descargas en tu explorar de archivos", "success","success");
          } else {
            this.alertasService.mostrarAlerta(
              "Error!",
              "La orden de compra no existe",
              "error",
              "danger"
            );
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
        }
      );
  }

  updateStatus(status: any) {
    this.status = status;
  }

  //Funciones de la tabla
  ordenarPor(columna: keyof any) {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla() {
    this.busqueda2 = "";
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      "folio",
      "usuario_destino",
      "motivo",
      "fecha",
      "usuario_solicita",
      "empresa",
      "estado",
      "centro_costo",
    ]);
  }

  filtrarTabla2() {
    this.busqueda = "";
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda2, [
      "folio",
      "usuario_destino",
      "motivo",
      "fecha",
      "usuario_solicita",
      "empresa",
      "estado",
      "centro_costo",
    ]);
  }
}
