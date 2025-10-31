import { Component, OnInit} from '@angular/core';
import { FuncionesTablas } from '../compras/funciones-tablas';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

import { ModalAddAutotanqueComponent } from './modal-add-autotanque/modal-add-autotanque.component';
import { ModalUpdtAutotanqueComponent } from './modal-updt-autotanque/modal-updt-autotanque.component';
import { ModalCostosUnidadComponent } from './modal-costos-unidad/modal-costos-unidad.component';
import { ModalHistorialComentariosComponent } from './modal-historial-comentarios/modal-historial-comentarios.component';
import { ModalHistorialPolizasComponent } from './modal-historial-polizas/modal-historial-polizas.component';

import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
  import { PermisosService } from 'src/app/core/services/permisos.service';
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
    private permisosService: PermisosService,
  ){}

  ngOnInit(): void {
    this.getEmpresas();
    // this.getUsuarioActivo();
  }

 public  estatusColores = [
  { color: '#28a745', dsc: 'Activa' },
  { color: '#df2727ff', dsc: 'Fuera de circulación' },
  { color: '#ffc107', dsc: 'En taller' },
  { color: '#17a2b8', dsc: 'Vendida' },
  { color: '#343a40', dsc: 'No identificada' },
  { color: '#e83e8c', dsc: 'Descompuesta' },
  { color: '#007bff', dsc: 'En Fiscalía' },
  { color: '#6610f2', dsc: 'En Depósito vehicular' },
  { color: '#495057', dsc: 'Chatarra' },
  { color: '#fd7e14', dsc: 'Vendida como chatarra' },
  { color: '#dc3545', dsc: 'Baja' },
  { color: '#adb5bd', dsc: 'Desconocido' }
];

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

  public intercompania:any = null;

  public totalDatos:any;
  public totalDatosFiltrados:any;

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }
  
  public empresas:any;
  public rawEmpresas:any;

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'entidad', 'marca_vehiculo', 'submarca', 
      'modelo', 'no_serie', 'placas',
      'marca_tanque', 'anio_fabricacion', 'capacidad',
      'tipo_medidor', 'serie','eco',
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
  
          this.getCatVehiculos(this.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  public openModalInfo() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
            unidad : this.unidad
          },
          class: "modal-lg",
        };
        this.modalRef = this.modalService.show(
          ModalCostosUnidadComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          this.getCatVehiculos(this.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  public openModalHistorial() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
            unidad : this.unidad
          },
          class: "modal-md",
        };
        this.modalRef = this.modalService.show(
          ModalHistorialComentariosComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          this.getCatVehiculos(this.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  public openModalHistorialPolizas() {
    this.modalAbierto =  true;
    const initialState: ModalOptions = {
          initialState: {
            unidad : this.unidad
          },
          class: "modal-md",
        };
        this.modalRef = this.modalService.show(
          ModalHistorialPolizasComponent,
          initialState
        );
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
  
          this.getCatVehiculos(this.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
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
          this.getCatVehiculos(this.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }


  contarDatos(){

    this.totalDatosFiltrados = this.datosFiltrados.length
    this.totalDatos = this.data.length 
    
  }

  private getCatVehiculos(intercompania) {
    this.mostrar = false;
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
          this.alertasService.mostrarAlerta("Error", response.message, "error" , "danger" );
          this.showTable =  false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
        this.showTable =  false;
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
          this.rawEmpresas = rawData.filter(objeto => objeto.isAgencia === false);
          this.getUsuarioActivo();
          this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta("Error", response.message, "error" , "danger" );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
      }
    );
  }

    public getUsuarioActivo() {
    const currentUser = this.localStorage.getItem("currentUser");
    const usuarioActivo = currentUser['usuarioActivo'][0];
    const multiselect = usuarioActivo.multiselect;
    const intercompania = usuarioActivo.intercompania;
    const enpresa = usuarioActivo.empresa;
    const enpresas = usuarioActivo.empresas;
    this.usuarioSolicita = usuarioActivo;

          if(intercompania !== 333 && !multiselect){
             this.getCatVehiculos(intercompania);
             this.intercompania =  intercompania;
          }

          if(intercompania == 333 || multiselect){
            if(enpresas !=  null){
              this.filtrarEmpresas(this.rawEmpresas, enpresas);
            }
            else{
              this.empresas = this.rawEmpresas;
            } 
          }
  }

  filtrarEmpresas(data, empRel) {
    this.empresas = data.filter((empresa) =>
      empRel.includes(empresa.intercompania)
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


    public openAutorizar() {
        Swal.fire({
          title: "¿Deseas autorizar esta unidad?",
          text: "Ingresa tus comentarios u observaciones acerca de esta unidad",
          input: "textarea",
          inputAttributes: {
            autocapitalize: "off",
          },
          icon: "info",
          confirmButtonText: "Sí, autorizar",
          showCancelButton: true,
          cancelButtonText: "No",
          customClass: {
            confirmButton: "btn btn-success px-4",
            cancelButton: "btn btn-danger ms-2 px-4",
          },
          buttonsStyling: false,
          preConfirm: (razon) => {
            if (!razon || razon.trim() === '') {
                    Swal.showValidationMessage('Debes de agregar tus comentarios al autorizar la unidad');
                    return false;
                  }
                  return razon;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const payload = {
              idVehiculo: this.unidad?.id,
              observacion: result.value,
            };

            this.unidades.autorizarVehiculo(payload).subscribe(
              (response) => {
                if ((response.status = "success")) {
                   this.alertasService.mostrarAlerta(
                     "Listo",
                     response.message,
                     "success",
                     "success"
                   );
                   this.getCatVehiculos(this.intercompania);
                 }
               },
               (error) => {
                 this.alertasService.mostrarAlerta(
                   "Error",
                   error,
                   "error",
                   "danger"
                 );
               }
              );
          }
        });
    }

    tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}
