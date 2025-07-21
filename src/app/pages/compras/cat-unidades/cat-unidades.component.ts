import { Component, OnInit} from '@angular/core';
import { FuncionesTablas } from '../compras/funciones-tablas';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAddAutotanqueComponent } from './modal-add-autotanque/modal-add-autotanque.component';
import { ModalUpdtAutotanqueComponent } from './modal-updt-autotanque/modal-updt-autotanque.component';
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cat-unidades',
  templateUrl: './cat-unidades.component.html',
  styleUrl: './cat-unidades.component.css'
})
export class CatUnidadesComponent implements OnInit{

  constructor(
    private modalService: BsModalService,
    private unidades : UnidadesService,
    private usuariosService: UsuariosService,
    private localStorage: LocalStorageServiceService,
    private alertasService: SwalComprsServiceService,
  ){}

  ngOnInit(): void {
    this.getEmpresas();
    this.getUsuarioActivo();
  }

  public usuarioSolicita: any = {
      id: null,
      firstname: "",
      realname: "",
      name: "",
      puesto: "",
      Telfono: "",
      direccion: "",
      intercompania: 333,
      empresa: "",
      isAgencia: false
  };

  datosFiltrados:any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  public unidad:any;
  public mostrar : boolean = false;
  public showTable : boolean = false;

  public data:any;
  public modalAbierto:boolean = false;
  public isLoading: boolean = true;
  public isLoad:boolean = false;

  public modalRef?: BsModalRef;

  public intercompania:any;

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }
  
  public empresas:any;

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'entidad', 'marca_vehiculo', 'submarca', 
      'modelo', 'no_serie', 'placas',
      'marca_tanque', 'anio_fabricacion', 'capacidad',
      'tipo_medidor', 'serie',
    ]);
    this.contarDatos();
  }

  // Despliega la ventana modal para un nuevo registro
  public openModalNuevo() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
            intercompania : this.intercompania,
            empresas: this.empresas
          },
          class: "modal-lg",
        };
        this.modalRef = this.modalService.show(
          ModalAddAutotanqueComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          // this.mostrar = false;
          this.getCatVehiculos(this.usuarioSolicita.intercompania);
        });
        // this.modalRef.content.modalCerrado.subscribe(() => {
        //   this.modalAbierto = false;
        // });
  }

  // Despliega la ventana modal para un nuevo registro
  public openModalUpdate() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
            datos : this.unidad, 
            intercompania : this.intercompania,
            empresas: this.empresas
          },
          class: "modal-lg",
        };
        this.modalRef = this.modalService.show(
          ModalUpdtAutotanqueComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          // this.mostrar = false;
          this.getCatVehiculos(this.usuarioSolicita.intercompania);
        });
        // this.modalRef.content.modalCerrado.subscribe(() => {
        //   this.modalAbierto = false;
        // });
  }

  public totalDatos:any;
  public totalDatosFiltrados:any;
  contarDatos(){

    this.totalDatosFiltrados = this.datosFiltrados.length
    this.totalDatos = this.data.length 
    
  }

  private getCatVehiculos(intercompania) {
    this.intercompania =  intercompania;
    this.isLoad = true;
    this.showTable =  false;
    this.unidades.getVehiculos(intercompania).subscribe(
      (response) => {
        if (response) {
          this.data = response.data;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];

          this.contarDatos();
          this.isLoad = false;
          this.showTable = true;
          
        } else {
          console.log(response.message);
          this.showTable =  false;
        }
      },
      (error) => {
        this.showTable =  false;
        console.error("Error fetching data:", error);
      }
    );
    
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

  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.empresas = rawData.filter(objeto => objeto.isAgencia === false);
          this.isLoading = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

    public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      (response) => {
        if (response.status === "success") {

          this.usuarioSolicita = response.data[0];
          if(this.usuarioSolicita.intercompania !== 333){
            this.getCatVehiculos(this.usuarioSolicita.intercompania);
            this.intercompania =  this.usuarioSolicita.intercompania;
          }

        } else {
          this.alertasService.mostrarAlerta(
            response.message,
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );
          // this.closeModal.emit();
          // this.cerrarModal();
          return;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
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
          this.unidades.delete(this.unidad.id).subscribe(
            (response) => {
              if (response.status === "success") {
                this.getCatVehiculos(this.intercompania);
                this.alertasService.mostrarAlerta("Borrado!", 
                  "El registro ha sido borrado.", "success", "danger")
              } else {
                this.alertasService.mostrarAlerta("Error!", 
                  response.message, "success", "danger")
              }
            },
            (error) => {
              this.alertasService.mostrarAlerta("Error fetching data:", 
                error, "success", "danger")
            }
          );
        }
        this.isLoad = false;
      });
    }
}
