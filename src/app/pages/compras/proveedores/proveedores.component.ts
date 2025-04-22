import { Component, OnInit} from "@angular/core";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { CatEstadosService } from "src/app/core/services/cat-estados.service";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";
import { FuncionesTablas } from "../compras/funciones-tablas";

import { ModalAddProveedorComponent } from "./modal-add-proveedor/modal-add-proveedor.component";
import { ModalUpdtProveedorComponent } from "./modal-updt-proveedor/modal-updt-proveedor.component";
import { ModalShowProveedorComponent } from "./modal-show-proveedor/modal-show-proveedor.component";


@Component({
  selector: "app-proveedores",
  templateUrl: "./proveedores.component.html",
  styleUrls: ["./proveedores.component.css"],
})
export class ProveedoresComponent implements OnInit {

  estados: any[] = [];
  public data: any;
  formData: FormData = new FormData();

  public showTable: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;
  public isCredit: boolean = false;

  dtOptions: Config = {};

  public modalRef?: BsModalRef;
  public submitted: boolean = false;

  public proveedor: any;
  public expediente: any;
  public archivos: any;
  public tamanioExp:any;

  //Variables funciones tablas
  datosFiltrados:any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  constructor(
    private proveedoresService: ProveedoresService,
    private catEstadosService: CatEstadosService,
    private modalService: BsModalService
  ) {}

  public ngOnInit(): void {
    this.getAll();
    this.selectLocalidad();
  }

  public openModalNuevo() {
    const initialState: ModalOptions = {
      initialState: {
        estados: this.estados
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalAddProveedorComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
  }

  public openModalActualizar() {
    const initialState: ModalOptions = {
      initialState: {
        proveedor: this.proveedor,
        estados: this.estados,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalUpdtProveedorComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
  }

  public openModalExpedientes() {
    const initialState: ModalOptions = {
      initialState: {
        proveedor: this.proveedor,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(
      ModalShowProveedorComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe((res: any) => {});
  }

  public selectLocalidad() { //LLena el select localidad desde cat_estados.json
    this.catEstadosService.getData().subscribe((data) => {
      this.estados = data;
    });
  }

  private getAll() { //Recupera todos los registros de los proveedores
    this.proveedoresService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];

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

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'nombre', 'contacto', 'telefono',
      'localidad', 'condiciones'
    ]);
  }

  public destroy() {
    //Actualiza el estatus del registro a 0
    this.mostrar = false;
    this.isLoad = true;
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Se eliminara el registro seleccionado",
      icon: "error",
      confirmButtonText: "Eliminiar",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.proveedoresService.destroy(this.proveedor.id).subscribe(
          (response) => {
            if (response.status === "success") {
              this.getAll();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            } else {
              console.log(response.message);
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

  public seleccionar(dato: any, evento: any) {
    //Función para resaltar el elemento seleccionado
    this.mostrar = true;
    this.proveedor = dato;
    this.isCredit = false;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.expediente = null;
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }
}
