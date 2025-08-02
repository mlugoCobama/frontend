import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalComprasMacroComponent } from './modal-compras-macro/modal-compras-macro.component';
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { EstadoSolicitud } from '../compras/estado-solicitud.enum';
import { FuncionesTablas } from '../compras/funciones-tablas';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

import Swal from "sweetalert2";

@Component({
  selector: 'app-compras-macro',
  templateUrl: './compras-macro.component.html',
  styleUrl: './compras-macro.component.css'
})
export class ComprasMacroComponent implements OnInit{

    public modalRef?: BsModalRef;

    public isLoad: boolean = true;
    public modalAbierto: boolean = false;
    public solicitudSelecionada: boolean = false;
    public habilitarDescarga = false;
    public mostrarBoton:boolean = false;
    public solicitudCompra: any;
    public data:any;
    public status:any;
    public enEsts = EstadoSolicitud;

    // varibles funciones tablas
    datosFiltrados:any[] = [];
    private ordenador!: FuncionesTablas<any>;
    busqueda:string = '';

  constructor( 
      public ordenesComprasService: OrdenesCompraService,
      public alertasService: SwalComprsServiceService,
      private modalService  : BsModalService,
      private comprasMacro  : ComprasMacroService,
      public comprasService  : ComprasService,
      public localStorage : LocalStorageServiceService
   )
  {}

  ngOnInit(): void {
    // this.getUsuarioActivo();
    this.comprasService.mostrarBoton$.subscribe((mostrar) => {
      this.mostrarBoton = mostrar;
    });
    this.getAll();

  }

  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");
      return {
        intercompania :usuarioActivo['role']['intercompania'],
        idUser :usuarioActivo['role']['id']
      };
  }

  public openModalNuevo() {
    this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        //Datos que envió al componente
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalComprasMacroComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
    this.modalRef.content.modalCerrado.subscribe(() => {
        this.modalAbierto = false;
      });
  }

  public regresar() {
    this.comprasService.cambiarEstadoCotizacion(false);
    this.solicitudSelecionada = false;
    this.status = null;
    this.mostrarBoton = false;
    this.getAll();
  }

    private getAll() {
      const user = this.getUsuarioActivo();
      this.comprasMacro.getAll(user.intercompania, user.idUser).subscribe(
        (response) => {
          if (response) {
            this.data = response.data;

            this.ordenador = new FuncionesTablas(this.data);
            this.datosFiltrados = [...this.data];

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
                this.regresar();
                this.alertasService.mostrarAlerta("Cancelada!", "La solicitud ha sido cancelada.", "success","success");
              } else {
                this.alertasService.mostrarAlerta("Error!", "Ocurrió un error inesperado", "error","error");
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
            // this.alertasService.mostrarAlerta("Descargando", "Revisa el apartado de descargas en tu explorar de archivos", "success","success");
          } else {
            this.alertasService.mostrarAlerta("Error!", "La orden de compra no existe", "error","danger");
          }
        },(error) => {
          this.alertasService.mostrarAlerta("Error!", "No es posible descargar la orden de compra", "error","danger");
        });
    }
  
    updateStatus(status: any) {
      this.status = status;
    }

    //Funciones de la tabla
  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'folio', 'usuario_destino', 'motivo',
      'fecha', 'usuario_solicita', 'empresa', 'estado'
    ]);
  }
}
