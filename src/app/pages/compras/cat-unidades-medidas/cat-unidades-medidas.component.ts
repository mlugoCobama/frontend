import { Component, OnInit} from '@angular/core';


import { FuncionesTablas } from '../compras/funciones-tablas';
import { environment } from 'src/environments/environment';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";
import { Config } from 'datatables.net';
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";

import { ModalAddUnidadComponent } from "./modal-add-unidad/modal-add-unidad.component";
import { ModalUpdtUnidadComponent } from './modal-updt-unidad/modal-updt-unidad.component';



@Component({
  selector: "app-cat-unidades-medidas",
  templateUrl: "./cat-unidades-medidas.component.html",
  styleUrls: ["./cat-unidades-medidas.component.css"],
})

export class CatUnidadesMedidasComponent implements OnInit{  
  public showTable: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;

  public data: any;
  
  public modalRef?: BsModalRef;
  public unidad: any;
  dtOptions: Config = {};

  datosFiltrados:any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.getAll();
    this.dtOptions = environment.dataTables;
  }

    // Despliega la ventana modal para un nuevo registro
    public openModalNuevo() {
      const initialState: ModalOptions = {
        initialState: {
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalAddUnidadComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.isLoad = true;
        this.mostrar = false;
        this.getAll();
      });
    }
  
    // Despliega una ventana modal para actualizar los registros
    public openModalActualizar() {
      const initialState: ModalOptions = {
        initialState: {
          unidad: this.unidad,

        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalUpdtUnidadComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      
      this.modalRef.content.event.subscribe(() => {
        this.isLoad = true;
        this.mostrar = false;
        this.getAll();
      });
    }

  // Recupera todos los regsitros de las unidades en la bse de datos 
  private getAll() {
    this.catUnidadesMedidasService.getAll().subscribe(
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
      'nombre', 'abreviatura'
    ]);
  }
//Recupera los datos del elemento seleccionado
  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.unidad = dato;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }

//"Borra" el registro seleccionado
  public destroy() {
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
        this.catUnidadesMedidasService.destroy(this.unidad.id).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.message);
              this.getAll();
              Swal.fire({
                title: "Borrado!",
                text: "El registro ha sido borrado.",
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
}
