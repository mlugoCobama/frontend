import { Component, OnInit } from '@angular/core';
import { VendedoresService } from 'src/app/core/services/nissan/vendedores.service';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAddVendedorComponent } from './modal-add-vendedor/modal-add-vendedor.component';
import { ModalUpdateVendedorComponent } from './modal-update-vendedor/modal-update-vendedor.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2';

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
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  public data: any;
  public datosFiltrados: any;
  public ordenador: any;
  public busqueda = "";
  public isLoad: boolean = true;

  public itemSeleccionado = false;

  public modalRef?: BsModalRef;

  public vendedor: any;

  /** recupera todos los registros de los vendedores */
  private getAll() {
    this.isLoad = true;
    this.vendedoresService.getAll().subscribe(
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
    // this.modalAbierto =  true;
    const initialState: ModalOptions = {
      initialState: {},
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
      this.getAll();
    });
  }

  /** Despliega la ventana modal para actualizar un registro  */
  public openModalEditar() {
    // this.modalAbierto =  true;
    const initialState: ModalOptions = {
      initialState: {
        datos: this.vendedor,
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
      this.getAll();
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
}
