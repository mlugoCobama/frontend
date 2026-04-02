import { Component, OnInit } from '@angular/core';

import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { TomaUnidadesModalComponent } from '../comisiones-toma-unidades/toma-unidades-modal/toma-unidades-modal.component';
import { VendedoresService } from 'src/app/core/services/nissan/vendedores.service';

import { AccesoriosService } from 'src/app/core/services/renault/accesorios.service';

import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { configuracionesAceessLevel, configTablaFinanciamiemto,  configEstadosFinanciamiento} from './modelo-accesorios';
import { AccesorioModalComponent } from './accesorio-modal/accesorio-modal.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comisiones-accesorios',
  templateUrl: './comisiones-accesorios.component.html',
  styleUrl: './comisiones-accesorios.component.css'
})
export class ComisionesAccesoriosComponent implements OnInit {
  public data = [];
  public vendedores: any[] = [];
  public filaSeleccionada: any = null;
  public isLoad: boolean = false;
  public buscando = false;
  public columnasVendedor: any[] = configTablaFinanciamiemto;
  public misEstados = configEstadosFinanciamiento;
  public showFiltro = true;
  public estadoDefault;

  public configFiltro = {
    showEstado: true,
    showVendedor: true,
    showTipoVenta: false,
  };

  hayDatos = false;
  descargando = false;
  formularioValido = false;

  public accionesTabla: any[] = [
    {
      icono: "fas fa-backward",
      clase: "btn-warning",
      tooltip: "Devolver al estado anterior",
      // Solo si NO está en el primer estado ni pagada
      visible: (item) => item.estatus > 1 && item.estatus !== 3,
      accion: async (item) => await this.devolver(item),
    },
    {
      icono: "fas fa-exclamation-triangle",
      clase: "btn-info",
      tooltip: "Ver comentarios",
      // Solo si tiene comentarios
      visible: (item) => !!item.comentario,
      accion: (item) => this.mostrarObs(item),
    },
    {
      icono: "fas fa-check",
      clase: "btn-primary",
      tooltip: "Visto bueno",
      // Solo si está por autorizar o autorizada (no pagada ni rechazada)
      visible: (item) => [1, 2].includes(item.estatus),
      accion: async (item) => await this.avanzarEstado(item),
    },
  ];

  constructor(
    private modalService: BsModalService,
    private vendedoresService: VendedoresService,
    private accesoriosService: AccesoriosService,
    private alertas: SwalComprsServiceService,
    private permisosService: PermisosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getVendedores(1);
    this.asignarEstado();
  }

  public modalRef?: BsModalRef;
  /** Despliega la ventana modal para un nuevo registro  */
  public openModalNuevo() {
    const initialState: ModalOptions = {
      initialState: {
        vendedores: this.vendedores,
        empresaActiva : this.getEmpresaActiva()
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      AccesorioModalComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      // this.isLoad = true;
      // // this.mostrar = false;
      this.getAll();
    });
  }

  public openModalActualizar() {
    // this.modalAbierto =  true;
    const initialState: ModalOptions = {
      initialState: {
        data: this.filaSeleccionada,
        vendedores: this.vendedores,
        empresaActiva : this.getEmpresaActiva()
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      AccesorioModalComponent,
      initialState,
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      // this.isLoad = true;
      // // this.mostrar = false;
      this.getAll();
    });
  }

  private getVendedores(intercompania) {
    this.isLoad = true;
    this.vendedoresService.getOne(intercompania).subscribe(
      (response: any) => {
        if (response) {
          this.vendedores = response.data;
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

  private getAll() {
    this.isLoad = true;
    this.accesoriosService.getAll().subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
          console.log(this.data);
          // this.ordenador = new FuncionesTablas(this.data);
          // this.datosFiltrados = [...this.data];
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

  onItemSeleccionado(item: any | null): void {
    this.filaSeleccionada = item;
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
        return this.accesoriosService
          .delete(this.filaSeleccionada.id)
          .toPromise()
          .then((response: any) => {
            if (response.status === "success") {
              this.alertas.mostrarAlerta(
                "Listo!",
                response.message,
                "success",
                "success",
              );
              this.getAll();
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

  onDescargar(valores: any): void {}

  onReset(): void {
    this.hayDatos = false;
    this.data = [];
  }

  buscarDatos(datos) {
    this.buscando = true;
    this.isLoad = true;
    if (!this.formularioValido) {
      this.alertas.mostrarAlerta(
        "Error",
        "Llena correctamente los parametros del filtro",
        "info",
        "info",
      );
      this.buscando = false;
      this.isLoad = false;
      return;
    }

    const param = datos;

    this.accesoriosService
      .getLibroVentas(
        param.estado,
        param.agencia,
        param.fechaInicial,
        param.fechaFinal,
        param.vendedor,
      )
      .subscribe(
        (response: any) => {
          if (response.status == "success") {
            this.data = response.data;
            this.buscando = false;
            this.isLoad = false;
          } else {
            this.alertas.mostrarAlerta(
              "Error",
              "Algo salio mal en la búsqueda",
              "info",
              "info",
            );
            this.buscando = false;
            this.isLoad = false;
            return;
          }
        },
        (error) => {
          this.alertas.mostrarAlerta(
            "Error",
            `Error fetching data: ${error}`,
            "error",
            "danger",
          );
          this.buscando = false;
          this.isLoad = false;
          return;
        },
      );
  }

  async devolver(row: any): Promise<void> {
    const { value: razon, isConfirmed } = await Swal.fire({
      title: "Va a devolver esta partida al estado anterior",
      text: "Agrega la razón del porqué está regresando",
      input: "textarea",
      inputPlaceholder: "Escribe la razón aquí...",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary m-1",
        cancelButton: "btn btn-secondary m-1",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) return "El campo es obligatorio";
        return null;
      },
    });

    if (!isConfirmed || !razon) return;

    const response: any = await firstValueFrom(
      this.accesoriosService.devolverPartida(row.id, { comentario: razon }),
    );

    if (response.status === "success") {
      this.alertas.mostrarAlerta(
        "Listo",
        response.message,
        "success",
        "success",
      );
      this.removerFila(row.id);
    } else {
      this.alertas.mostrarAlerta("Error", response.message, "error", "danger");
    }
  }

  async avanzarEstado(row: any): Promise<void> {
    const { isConfirmed } = await Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción avanzará la partida al siguiente estado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, avanzar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary m-1",
        cancelButton: "btn btn-secondary m-1",
      },
      buttonsStyling: false,
    });

    if (!isConfirmed) return;

    const response: any = await firstValueFrom(
      this.accesoriosService.avanzarEstado(row.id),
    );

    if (response.status === "success") {
      this.alertas.mostrarAlerta(
        "Listo",
        response.message,
        "success",
        "success",
      );
      this.removerFila(row.id);
    } else {
      this.alertas.mostrarAlerta("Error", response.message, "error", "danger");
    }
  }

  /** Remueve la fila de tabla y del from array */
  removerFila(index: number) {
    let indice = this.data.findIndex((p) => p.id === index);

    if (indice !== -1) {
      this.data.splice(indice, 1);
      this.data = [...this.data];
    }
  }

  mostrarObs(item) {
    this.alertas.mostrarAlerta(
      "Comentario:",
      item.comentario ?? "No hay comentarios",
      "info",
      "info",
    );
  }

  async verDocumento(item: any): Promise<void> {
    // Abrir el archivo en una nueva pestaña
    if (item.ruta_archivo) {
      window.open(`/storage/${item.ruta_archivo}`, "_blank");
    }
  }

  asignarEstado() {
    const permisos = configuracionesAceessLevel;
    const encontrado = permisos.find((p) => this.tienePermiso(p.permiso));

    this.showFiltro = encontrado ? true : false;
    if (this.showFiltro) {
      this.configFiltro = encontrado.configFiltro;
      this.estadoDefault = encontrado.estadoDefault;
    }

    return encontrado?.estadoDefault ?? 0;
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  
  getEmpresaActiva(): string {
    return this.route.parent?.snapshot.url[0]?.path || '';
  }
}