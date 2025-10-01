import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAsignaPuestoComponent } from './modal-asigna-puesto/modal-asigna-puesto.component';
import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';
import { FuncionesTablas } from '../../compras/compras/funciones-tablas';
import Swal from 'sweetalert2';

@Component({
  selector: "app-administracion",
  templateUrl: "./administracion.component.html",
  styleUrl: "./administracion.component.css",
})
export class AdministracionComponent implements OnInit {
  public modalRef?: BsModalRef;

  public empresas: any = [];
  public puestos: any = [];
  public data: any = [];

  public havePuestos: boolean = false;
  public haveEmpresas: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;
  public dato:any = [];

  datosFiltrados: any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  constructor(
    private modalService: BsModalService,
    private administracion: AdministracionService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getEmpresas();
    this.getPuestos();
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const latitude = position.coords.latitude;
    //   const longitude = position.coords.longitude;
    //   console.log(`Lat: ${latitude}, Lon: ${longitude}`);
    // });


  }

  public openModalNuevo() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        empresas: this.empresas,
        puestos: this.puestos,
        tipo: 'Agregar',
        //Datos que envió al componente
      },
      class: "modal-md",
    };
    this.modalRef = this.modalService.show(
      ModalAsignaPuestoComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getData();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

  public openModalAct() {
    // this.modalAbierto = true;
    const initialState: ModalOptions = {
      initialState: {
        empresas: this.empresas,
        puestos: this.puestos,
        tipo: 'Actualizar',
        datos: this.dato,
        //Datos que envió al componente
      },
      class: "modal-md",
    };
    this.modalRef = this.modalService.show(
      ModalAsignaPuestoComponent,
      initialState
    );
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.isLoad = true;
      this.getData();
    });
    // this.modalRef.content.modalCerrado.subscribe(() => {
    //     this.modalAbierto = false;
    //   });
  }

  public getPuestos() {
    this.administracion.getPuestos().subscribe(
      (response) => {
        if (response) {
          this.puestos = response.data;
          this.havePuestos = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public getData() {

    this.isLoad = true;
    this.administracion.getAll().subscribe(
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
  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.administracion.getEmpresas().subscribe(
      (response) => {
        if (response) {
          console.log(response.data)
          this.empresas = this.filtrarEmpresas(response.data);
          this.haveEmpresas = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  filtrarEmpresas(data) {
  const excluirEmpresas = [706, 7074, 2000, 7072, 7075, 7102];
  return data.filter((empresa) => {
    const cumpleCondicion = +empresa.intercompania >= 700 || +empresa.intercompania === 333;
    const noExcluida = !excluirEmpresas.includes(empresa.intercompania);
    return cumpleCondicion && noExcluida;
  });
}



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
            this.administracion.destroy(this.dato.id).subscribe(
              (response) => {
                if (response.status === "success") {
                  console.log(response.message);
                  this.getData();
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
        'puesto', 'empresa', 'usuario',
      ]);
    }
}
