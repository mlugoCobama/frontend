import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import { ModalSalidaInventarioComponent } from './modal-salida-inventario/modal-salida-inventario.component';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { SalidaDetalleModalComponent } from './salida-detalle-modal/salida-detalle-modal.component';
import { AlmacenProductosService } from 'src/app/core/services/compras/almacen-productos.service';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { ModalMovimientosAlmacenComponent } from './tabla-existencias/modal-movimientos-almacen/modal-movimientos-almacen.component';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

@Component({
  selector: "app-almacen",
  templateUrl: "./almacen.component.html",
  styleUrl: "./almacen.component.css",
})
export class AlmacenComponent implements OnInit {

  private administracion = inject(UsuariosService);
  private almacenProductos = inject(AlmacenProductosService);

  constructor(
    private almacenService: AlmacenService,
    private permisosService: PermisosService,
    private alertasService: SwalComprsServiceService,
    private localStorage: LocalStorageServiceService,
    private modalService: BsModalService,
  ) {}

  public data: any = [];
  public entradasPendientes: any = [];
  public salidas: any = [];
  public tecnicos = [];
  public empresas = [];
  public isLoad: boolean = false;
  public modalRef?: BsModalRef;
  public ordenador!: FuncionesTablas<any>;

  public empresaSeleccionada: string | "" = "";
  public tiposSalidaSeleccionada: string | "" = "";

  public existencias: any[] = [];
  public existenciasFiltrados: any[] = [];

  public panel: string = "existencias";

  public tiposSalida = [
    {
      tipo: '1',
      nombre: "Compras Generales",
      permiso: "view option select cg tipo almacen",
    },
    {
      tipo: '2',
      nombre: "Compras Macrotaller",
      permiso: "view option select mt tipo almacen",
    },
    {
      tipo: '3',
      nombre: "Recursos Tecnologicos",
      permiso: "view option select mt tipo almacen",
    },
  ];

  public totalDatosFiltrados: any;
  modelFiltrado = [
    "stock",
    "empresa",
    "clave_interna",
    "descripcion_planta",
    "descripcion_proveedor",
    "unidad_medida",
    "subcategoria",
  ];

  public configTablaSalidas: ColumnaTabla[] = [
    { campo: "folio", etiqueta: "Folio", bold: true, align: "center" },
    { campo: "fecha", etiqueta: "Fecha", pipe: "date" },
    { campo: "usuario_entrega", etiqueta: "Usuario Entrega" },
    { campo: "usuario_recibe", etiqueta: "Usuario Recibe" },
  ];

  ngOnInit(): void {
    this.getTecnicos();
    this.getEmpresas();
    this.setLocalUser();
  }


  onEmpresaChange(): void {

    switch (this.panel) {
      case "existencias":
        this.getExistencias(this.empresaSeleccionada, this.tiposSalidaSeleccionada);
        break;
      case "salidas":
        this.getSalidas(this.empresaSeleccionada, this.tiposSalidaSeleccionada);
        break;
      default:
        this.panel = "existencias";
        break;
    }


  }

  private getExistencias(intercompania = "", tipo ="") {
    this.isLoad = true;

    const payload = {
      intercompania: intercompania,
      tipo: tipo,
    }

    this.almacenProductos.getExistenciaFiltro(payload).subscribe(
      (response) => {
        if (response) {
          this.existencias = response.data;
          this.ordenador = new FuncionesTablas(this.existencias);
          this.existenciasFiltrados = [...this.existencias];
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        this.isLoad = false;
        console.error("Error fetching data:", error);
      },
    );
  }

  private getSalidas(intercompania = "", tipo ="") {
    this.isLoad = true;

    const payload = {
      intercompania: intercompania,
      tipo: tipo,
    }

    this.almacenService.getMovimientos(payload).subscribe(
      (response) => {
        if (response) {
          this.salidas = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger",
          );
          this.isLoad = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger",
        );
        this.isLoad = false;
      },
    );
  }

  private getTecnicos() {
    this.isLoad = true;
    this.almacenService.getTecnicosTi().subscribe(
      (response) => {
        if (response) {
          this.tecnicos = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger",
          );
          this.isLoad = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger",
        );
        this.isLoad = false;
      },
    );
  }

  openModalSsalida() {
    if (this.tecnicos.length == 0) {
      this.alertasService.mostrarAlerta(
        "Espera",
        "Estamos preparando la información",
        "info",
        "info",
      );
      return;
    }

  const initialState: ModalOptions = {
      initialState: {
        tecnicos: this.tecnicos,
        empresas: this.empresas,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalSalidaInventarioComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      // this.isLoad = true;
      this.setPanel("existencias");
    });
  }

  openModalDetalle(data: any) {
    const initialState: ModalOptions = {
      initialState: {
        data: data,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      SalidaDetalleModalComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.getSalidas(this.empresaSeleccionada, this.tiposSalidaSeleccionada);
    });
  }

  public getEmpresas() {
    this.administracion.getEmpresas().subscribe(
      (response) => {
        if (response) {
          // console.log(response.data)
          this.empresas = response.data;
          console.log(this.empresas);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
    );
  }



  setPanel(nombre: string) {
    switch (nombre) {
      case "existencias":
        this.panel = nombre;
        this.getExistencias(this.empresaSeleccionada, this.tiposSalidaSeleccionada);
        break;
      case "salidas":
        this.panel = nombre;
        this.getSalidas(this.empresaSeleccionada, this.tiposSalidaSeleccionada);
        break;
      default:
        this.panel = "existencias";
        break;
    }
  }

  public openModalMovimientos(data: any) {
      const initialState: ModalOptions = {
        initialState: {
          productoId: data.producto_id,
          almacenEmpresa: data.id,
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalMovimientosAlmacenComponent,
        initialState,
      );
      this.modalRef.content.closeBtnName = "Close";
      // this.modalRef.content.event.subscribe(() => {});
    }

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  public usuarioSolicita:any = [];
  public setLocalUser(){
    this.usuarioSolicita = this.localStorage.getLocalUser();
    this.empresaSeleccionada = this.usuarioSolicita.intercompania;
    if(!this.tienePermiso('select multitipo almacen')){
      this.tiposSalidaSeleccionada = '1';
    }
    if(!this.tienePermiso('select multiempresa almacen')){
      this.getExistencias(this.usuarioSolicita.intercompania, this.tiposSalidaSeleccionada);
    }
  }
}
