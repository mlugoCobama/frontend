import { Component, OnInit } from '@angular/core';
import { VendedoresService } from 'src/app/core/services/nissan/vendedores.service';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAddVendedorComponent } from './modal-add-vendedor/modal-add-vendedor.component';
import { ModalUpdateVendedorComponent } from './modal-update-vendedor/modal-update-vendedor.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { ActivatedRoute } from '@angular/router';
import { permisosVendedoresAgencias } from 'src/app/shared/constants/permisos';

@Component({
  selector: "app-vendedores",
  templateUrl: "./vendedores.component.html",
  styleUrl: "./vendedores.component.css",
})
export class VendedoresComponent implements OnInit {
  constructor(
    private vendedoresService: VendedoresService,
    private modalService: BsModalService,
    private alertas: SwalComprsServiceService,
    private permisosService: PermisosService,
    private localStorage: LocalStorageServiceService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getCatalogos();
    this.getAll(this.getEmpresaActiva().intercompania);
    
    this.agencias = this.filtrarAgencias(this.getEmpresaActiva().empresa);
  }

  public data: any;
  public datosFiltrados: any;
  public ordenador: any;
  public busqueda = "";
  public isLoad: boolean = true;

  public itemSeleccionado = false;

  public modalRef?: BsModalRef;

  public vendedor: any;
  public permisos = permisosVendedoresAgencias;
  /** recupera todos los registros de los vendedores */
  private getAll(intercompania) {
    this.isLoad = true;
    this.data = []
    this.datosFiltrados = [];
    this.vendedoresService.getOne(intercompania).subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      },
    );
  }

  /** Manejo del elemento seleccionado */
  public seleccionar(dato: any, evento: any) {
    this.itemSeleccionado = true;
    this.vendedor = dato;

    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.itemSeleccionado = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }

  ordenarPor(columna: keyof any) {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      "nombre",
      "clave",
      "nro_vendedor_as",
      "tipo_texto",
      "agencia_nombre",
      "procentaje_apv",
    ]);
  }

  /** Despliega la ventana modal para un nuevo registro  */
  public openModalNuevo() {
    if(!this.ready){
      Swal.fire('Espera', 'Aun no se han cargado los catálogos necesarios, espera e intenta nuevamente', 'info');
      return;
    }
    // this.modalAbierto =  true;
    const initialState: ModalOptions = {
      initialState: {
        agencias: this.agencias,
        tiposVendedor: this.tiposVendedor,
        departamentos: this.departamentos,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalAddVendedorComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      // this.mostrar = false;
      this.getAll(this.getEmpresaActiva().intercompania);
    });
  }

  /** Despliega la ventana modal para actualizar un registro  */
  public openModalEditar() {
    if(!this.ready){
      Swal.fire('Espera', 'Aun no se han cargado los catálogos necesarios, espera e intenta nuevamente', 'info');
      return;
    }
    const initialState: ModalOptions = {
      initialState: {
        datos: this.vendedor,
        agencias: this.agencias,
        tiposVendedor: this.tiposVendedor,
        departamentos: this.departamentos,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalUpdateVendedorComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      // this.mostrar = false;
      this.getAll(this.getEmpresaActiva().intercompania);
    });
  }

  /**  Despliega alerta de confirmación de eliminado de registro */
  confirmarDelete() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este registro será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.vendedoresService
          .delete(this.vendedor.id)
          .toPromise()
          .then((response: any) => {
            if (response.status === "success") {
              this.alertas.mostrarAlerta(
                "Listo!",
                response.message,
                "success",
                "success",
              );
              this.getAll(this.getEmpresaActiva().intercompania);
            } else {
              Swal.showValidationMessage(`Error: ${response.message}`);
            }
          })
          .catch((error) => {
            console.error("Error eliminando:", error);
            Swal.showValidationMessage(`Error: ${error}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Eliminación confirmada");
      }
    });
  }

  rawAgencias = [
    { value: "todos", name: "Todas", permiso: "view select agencias all" },
    {
      value: "710",
      name: "Nissan Universidad",
      permiso: this.permisos.optionNU,
    },
    {
      value: "0",
      name: "Nissan Insurgentes",
      permiso: this.permisos.optionNI,
    },
    {
      value: "730",
      name: "Nissan Azcapotzalco",
      permiso: this.permisos.optionNA,
    },
    {
      value: "714",
      name: "Nissan Campestre",
      permiso: this.permisos.optionNC,
    },
    {
      value: "1",
      name: "Renault Azcapotzalco",
      permiso: this.permisos.optionRA,
    },
    { value: "2", name: "Renault Ecatepec", permiso: this.permisos.optionRE },
    { value: "3", name: "Renault Vallejo", permiso: this.permisos.optionRV },
    { value: "4", name: "Renault Pachuca", permiso: this.permisos.optionRP },
  ];

  agencias = [];

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  filtrarAgencias(cadena) {
    const filtro = cadena.toLowerCase();
    if (filtro === "nissan") {
      return this.rawAgencias.filter((a) =>
        a.name.toLowerCase().includes("nissan"),
      );
    } else if (filtro === "lille" || filtro === "renault") {
      return this.rawAgencias.filter((a) =>
        a.name.toLowerCase().includes("renault"),
      );
    } else {
      return this.rawAgencias;
    }
  }

  getEmpresaActiva() {
    const usuarioActual = this.localStorage.getLocalUser();
    const empresaActual = this.route.parent?.snapshot.url[0].path || "";
    return {
      empresa: empresaActual,
      intercompania: usuarioActual.intercompania,
      empresaUsuario: usuarioActual.empresa,
    };
  }

  public tiposVendedor :any;
  public departamentos :any;
  public ready:boolean = false;

  getCatalogos(){
    this.data = []
    this.datosFiltrados = [];
    this.ready = false;
    this.vendedoresService.getAll().subscribe(
      (response: any) => {
        if (response) {
          const data = response.data;
          this.tiposVendedor = data.tipos;
          this.departamentos = data.departamentos;
          this.ready = true;
          console.log(this.ready)
        } else {
          console.log(response.message);
          this.ready = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
        this.ready = false;
      },
    );
  }
}
