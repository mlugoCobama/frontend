import { Component, OnInit, NgModule, OnDestroy } from "@angular/core";
import { environment } from "src/environments/environment";
import { ModalComprasComponent } from "./modal-compras/modal-compras.component";
import { ModalSeguimientoComponent } from "./modal-seguimiento/modal-seguimiento.component";
import { ModalPreviewOrdenCompraComponent } from "./modal-preview-orden-compra/modal-preview-orden-compra.component";
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
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";

@Component({
  selector: "app-compras",
  templateUrl: "./compras.component.html",
  styleUrls: ["./compras.component.css"],
})



export class ComprasComponent implements OnInit {
  vistaKanban: boolean = false;
  public tipoCompras = 1;

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


  isLoadingGenerarOrden = false;
  isLoadingCotizar = false;
  isLoadingVolverACotizar = false;
  isLoadingCancelar = false;
  isLoadingDevolverRevision = false;

  private readonly STORAGE_KEY_VISTA = 'vistaComprasKanban';

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
    private usuariosService: UsuariosService,
    private cotizacionesService: CotizacionesService,
  ) {}

  public ngOnInit(): void {
    this.comprasService.mostrarBoton$.subscribe((mostrar) => {
      this.mostrarBoton = mostrar;
    });

    const vistaGuardada = this.localStorage.getItem(this.STORAGE_KEY_VISTA);
    if (vistaGuardada !== null && vistaGuardada !== undefined) {
      this.vistaKanban = JSON.parse(String (vistaGuardada));
    }

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
          if(this.rawEmpresas){
            this.getUsuarioActivo();
          }
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

  public volverAcotizar() {
    this.isLoadingVolverACotizar = true;
    let folio = '';
    this.cotizacionesService.volverCotizar(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.alertasService.mostrarAlerta("Listo!",response.message,"success","success");
          folio = this.solicitudCompra.folio;
          this.regresar();
          this.busqueda = folio;
          this.isLoadingVolverACotizar = false;
          // this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta("Error!",response.message,"error","danger"
          );
          this.isLoadingVolverACotizar = false;
          console.log(response.message);
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
        this.isLoadingVolverACotizar = false;
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
    this.empresas = data
    // data.filter((empresa) =>
    //   empRel.includes(empresa.intercompania)
    // );
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
  public openDetallesSolicitud(dato: any, evento: any =  null)  {
    this.solicitudSelecionada = true;
      this.solicitudSelecionada = true;
      this.solicitudCompra = dato; // Objeto que se envía al detalleSolicitudCompra
      this.status = this.solicitudCompra.estatus;
    // }
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
    // this.vistaKanban = false;
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
  this.ordenesComprasService.pdfOrdenCompra(this.solicitudCompra.id).subscribe(
    (response) => {
      const blob = new Blob([response.body!], { type: "application/pdf" });
      const fileName = response.headers.get('X-Filename') || 'orden_compra.pdf';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
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

  public modelBusqueda = [  "folio", "usuario_destino",  "fecha",
                            "usuario_solicita", "empresa", "estado",
                          "centro_costo", "proveedor",  "total_orden",
                          "folio_oc", "modo_pago",  "pagado"];
  filtrarTabla() {
    this.busqueda2 = "";
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, this.modelBusqueda);
  }

  filtrarTabla2() {
    this.busqueda = "";
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda2, this.modelBusqueda);
  }

  openModalSeguimiento(item){
   this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        solicitudCompra: item
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalSeguimientoComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      // this.isLoad = true;
      // this.getAll(this.usuarioSolicita.intercompania);
    });
    this.modalRef.content.modalCerrado.subscribe(() => {
      this.modalAbierto = false;
    });
  }

  public openModalOC(item) {
    if(item.folio_oc != "-"){
      this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        solicitudCompra : item
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalPreviewOrdenCompraComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      // this.isLoad = true;
      // this.getAll(this.usuarioSolicita.intercompania);
    });
    this.modalRef.content.modalCerrado.subscribe(() => {
      this.modalAbierto = false;
    });
    }
    
  }

  public alternarVista(): void {
    this.vistaKanban = !this.vistaKanban;

    this.localStorage.setItem(
      this.STORAGE_KEY_VISTA,
      JSON.stringify(this.vistaKanban)
    );
  }

  public tienePermiso(permiso: string): boolean {
  const permisosRaw = localStorage.getItem('permisos');
  if (!permisosRaw) return false;
  
  try {
    const permisos = JSON.parse(permisosRaw);
    const lista = permisos.map((p: any) => p.name);
    return lista.includes(permiso);
  } catch {
    return false;
  }
}

enviarRevisionSolicitud() {
    Swal.fire({
      title: 'Aviso',
      text: 'Esta solicitud volverá al estado anterior, ingresa tus observaciones para volverla correcta',
      input: 'textarea',
      inputPlaceholder: 'Escribe tus observaciones aquí...',
      inputAttributes: {
        'aria-label': 'Escribe tus observaciones aquí'
      },
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false, 
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-sm btn-primary m-1',
        cancelButton: 'btn btn-sm btn-secondary m-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: this.solicitudCompra.id,
          motivo: result.value
        };

        Swal.fire({
          title: 'Enviando...',
          text: 'Por favor espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.comprasService.devolverSolictud(payload).subscribe(
        (response) => {
          this.isLoad = false;
          if (response.status === 'success') {
            this.regresar();
            this.alertasService.mostrarAlerta(
              'Listo!',
              'La solicitud ha sido devuelta para su revision.',
              'success',
              'success'
            );
          } else {
            this.alertasService.mostrarAlerta(
              'Error!',
              `Ocurrió un error inesperado :${response.message || ''}` ,
              'error',
              'danger'
            );
          }
        },
        (error) => {
          this.isLoad = false;
          this.alertasService.mostrarAlerta(
            'Error!',
            error,
            'error',
            'danger'
          );
        }
      );
      }
    });
  }
}
