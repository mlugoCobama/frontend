import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import { ModalEntradaAlmacenComponent } from "./modal-entrada-almacen/modal-entrada-almacen.component";
import { ModalSalidasMacroComponent } from "./modal-salidas-macro/modal-salidas-macro.component";

import { AlmacenService } from "src/app/core/services/macrotaller/almacen.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

import { FuncionesTablas } from "../../compras/compras/funciones-tablas";

@Component({
  selector: "app-almacen",
  templateUrl: "./almacen.component.html",
  styleUrl: "./almacen.component.css",
})
export class AlmacenComponent implements OnInit {
  public modalRef?: BsModalRef;

  public data: any = [];

  public isLoad: boolean = true;

  datosFiltrados: any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda: string = "";

  constructor(
    private modalService: BsModalService,
    private alerta: SwalComprsServiceService,
    private almacen: AlmacenService
  ) {}

  ngOnInit(): void {
    this.getAlmacen();
  }

  /**
   * Inicializa el modal para generar entradas de material
   */
  public openModalEntrada() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        tipo: "agregar",
        // empresas : this.empresas,
        //Datos que envió al componente
      },
      class: "modal-xl",
    };
    this.modalRef = this.modalService.show(
      ModalEntradaAlmacenComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAlmacen();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

  /**
   * Inicializa el modal para generar salidas de material
   */
  public openModalSalida() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        tipo: "agregar",
        // empresas : this.empresas,
        //Datos que envió al componente
      },
      class: "modal-xl",
    };
    this.modalRef = this.modalService.show(
      ModalSalidasMacroComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAlmacen();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }


  /**
   * Recupera los datos del almacen
   */
  private getAlmacen() {
    this.isLoad = true;
    this.almacen.getAlmacen().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];

          this.isLoad = false;
        } else {
          this.alerta.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger"
          );
          this.isLoad = false;
        }
      },
      (error) => {
        this.isLoad = false;
        this.alerta.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  ordenarPor(columna: keyof any) {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      "fecha_entrada",
      "empresa",
      "descripcion",
      "nombre",
      "observaciones",
      "existencia",
      "eco",
      "unidad",
    ]);
  }
}
