import { Component, OnInit} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import Swal from 'sweetalert2';

import { ModalPuestoComponent } from './modal-puesto/modal-puesto.component';
import { VerPermisosPuestoComponent } from './ver-permisos-puesto/ver-permisos-puesto.component';
import { ModalUpdtPuestoComponent } from './modal-updt-puesto/modal-updt-puesto.component';

import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';
import { PuestosService } from 'src/app/core/services/capacitaciones/puestos.service';

import { FuncionesTablas } from '../../compras/compras/funciones-tablas';

@Component({
  selector: 'app-cat-puestos',
  templateUrl: './cat-puestos.component.html',
  styleUrl: './cat-puestos.component.css'
})

export class CatPuestosComponent implements OnInit{

  public modalRef?: BsModalRef;

  public isLoad: boolean = true;
  public showTable: boolean = false;
  public ready: boolean = false;
  public mostrar: boolean = false;

    datosFiltrados: any[] = [];
    private ordenador!: FuncionesTablas<any>;
    busqueda:string = '';

  public data: any;
  public modulos: any;

  public  dato: any = [];

  constructor( 
        private modalService  : BsModalService,
        private administracion : AdministracionService,
        private puestos : PuestosService
     )
    {}
  
  ngOnInit(): void {
    this.getModulos();
    this.getAll();
  }

  public openModalNuevo() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        data : this.modulos 
        //Datos que envió al componente
      },
      class: "modal-md",
    };
    this.modalRef = this.modalService.show( ModalPuestoComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

  public openModalUpdt() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        id : this.dato.id,
        nombrePuesto: this.dato.nombre,
        //Datos que envió al componente
      },
      class: "modal-md",
    };
    this.modalRef = this.modalService.show( ModalUpdtPuestoComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getAll();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

  public openModalVerPermisos(id, nombrePuesto) {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        id : id, 
        nombrePuesto:nombrePuesto
        //Datos que envió al componente
      },
      class: "modal-md",
    };
    this.modalRef = this.modalService.show( VerPermisosPuestoComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

    private getModulos() {
      this.administracion.getAllModulos().subscribe(
        (response) => {
          if (response) {
            this.modulos = response.data;
            console.log(this.modulos)
            this.ready = true;
          } else {
            this.ready = false;
            console.log(response.message);
          }
        },
        (error) => {
          this.ready = false;
          console.error("Error fetching data:", error);
        }
      );
    }

    private getAll() {
      this.puestos.getAll().subscribe(
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

    // "Borra" el registro seleccionado
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
             this.puestos.destroy(this.dato.id).subscribe(
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
  
    ordenarPor(columna: keyof any){
      this.datosFiltrados = this.ordenador.ordenar(columna);
    }
  
    getIconoOrden(columna:keyof any):string{
      return this.ordenador.getIcono(columna)
    }
  
    filtrarTabla(){
      this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
        'nombre'
      ]);
    }

    //Recupera los datos del elemento seleccionado
      public seleccionar(dato: any, evento: any) {
        this.mostrar = true;
        this.dato = dato;
        if (evento.currentTarget.classList.contains("table-primary")) {
          evento.currentTarget.classList.remove("table-primary");
          this.mostrar = false;
        } else {
          const filas = document.querySelectorAll("tbody tr");
          filas.forEach((fila) => fila.classList.remove("table-primary"));
          evento.currentTarget.classList.add("table-primary");
        }
      }
}
