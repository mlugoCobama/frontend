import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { pmsParqueVehciular } from 'src/app/shared/constants/permisos';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EmpleadosService } from 'src/app/core/services/control-asistencia/empleados.service';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { estatusColores , categorias, categoriasGPS, modelFiltrado} from 'src/app/shared/constants/constantes-pv';
import { ModalEmpleadosComponent } from './modal-empleados/modal-empleados.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent implements OnInit {

  public empresas: any;
  public rawEmpresas: any;
  public isLoading: boolean = true;
  public isLoad: boolean = false;
  public permisos = pmsParqueVehciular;
  public mostrar: boolean = false;
  public intercompania: any = null;
  public showTable: boolean = false;
  public datosFiltrados: any[] = [];
  public data: any;
  public empleados: any;
  public modalAbierto: boolean = false;
  public empleado: any;

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
    isAgencia: false,
  };

  private routeSub!: Subscription;
  private ordenador!: FuncionesTablas<any>;
  private company_id: number = 0;
  private device_id: number = 0;
  private dataFinger: any;

  public concepto:any = '';
  public busqueda: string = "";
  public modelFiltrado = ['pin','first_name','last_name','status'];
  public totalDatos: any;
  public totalDatosFiltrados: any;
  public modalRef?: BsModalRef;



  constructor(
    private empleadosService: EmpleadosService,
    private modalService: BsModalService,
    private permisosService: PermisosService,
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService,
    private localStorage: LocalStorageServiceService,
    private route: ActivatedRoute,
  ) {}


  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.concepto = params.get('concepto');

    });

    this.setLocalUser();
    this.getEmpresas();
  }

  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.empresas = response.data;
          this.isLoading = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  public getEmpleados(intercompania:any) {

    this.intercompania = intercompania;

    this.empleadosService.getEmpleados(intercompania).subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.company_id = response.company_id;
          this.device_id = response.device_id;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];
          this.contarDatos();

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

  //Recupera los datos del elemento seleccionado
  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.empleado = dato;


    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }

  public destroy() {


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
          this.isLoad = true;
          this.empleadosService.delete(this.empleado.id).subscribe(
            (response) => {
              if (response.success === true) {
                this.getEmpleados(this.usuarioSolicita.intercompania);
                this.alertasService.mostrarAlerta(
                  "Borrado!",
                  "El registro ha sido borrado.",
                  "success",
                  "success"
                );
              } else {
                this.alertasService.mostrarAlerta(
                  "Error!",
                  response.message,
                  "success",
                  "danger"
                );
              }
            },
            (error) => {
              this.alertasService.mostrarAlerta(
                "Error fetching data:",
                error,
                "success",
                "danger"
              );
            }
          );
        }
        this.isLoad = false;
      });
    }


  public openModalNuevo () {
    this.modalAbierto = true;
        const initialState: ModalOptions = {
          initialState: {
            intercompania: this.intercompania,
            company_id: this.company_id,
            device_id: this.device_id
          },
          class: "modal-sm",
        };
        this.modalRef = this.modalService.show(ModalEmpleadosComponent, initialState);
        this.modalRef.content.closeBtnName = "Close";
        this.modalRef.content.event.subscribe(() => {
          this.isLoad = true;
          this.getEmpleados(this.usuarioSolicita.intercompania);
        });
        this.modalRef.content.modalCerrado.subscribe(() => {
          this.modalAbierto = false;
        });
  }

  // Despliega la ventana modal para un nuevo registro
    public openModalUpdate() {
      this.modalAbierto = true;
      const initialState: ModalOptions = {
        initialState: {
          datos: this.empleado,
          company_id: this.company_id,
          device_id: this.device_id,
          tipo: 'actualizar'
        },
        class: "modal-sm",
      };
      this.modalRef = this.modalService.show(
        ModalEmpleadosComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.isLoad = true;
        this.getEmpleados(this.usuarioSolicita.intercompania);
      });
      this.modalRef.content.modalCerrado.subscribe(() => {
        this.modalAbierto = false;
      });
    }

  public registerFinger() {

    this.dataFinger = {
        "finger_index": 6,
        "intercompania": this.intercompania
    }

    Swal.fire({
        title: "",
        text: "¿Deseas registrar la huella del empleado seleccionado?",
        icon: "info",
        confirmButtonText: "Resgitrar",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-primary px-4",
          cancelButton: "btn btn-danger ms-2 px-4",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.isLoad = true;
          this.empleadosService.enrollFingerprint(this.empleado.id, this.dataFinger).subscribe(
            (response) => {
              if (response.success === true) {
                this.getEmpleados(this.usuarioSolicita.intercompania);
                this.alertasService.mostrarAlerta(
                  "Registro!",
                  response.message,
                  "success",
                  "success"
                );
              } else {
                this.alertasService.mostrarAlerta(
                  "Error!",
                  response.message,
                  "success",
                  "danger"
                );
              }
            },
            (error) => {
              this.alertasService.mostrarAlerta(
                "Error fetching data:",
                error,
                "success",
                "danger"
              );
            }
          );
        }
        this.isLoad = false;
      });
  }

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  ordenarPor(columna: keyof any) {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, this.modelFiltrado);
    this.contarDatos();
  }

  contarDatos() {
    this.totalDatosFiltrados = this.datosFiltrados.length;
    this.totalDatos = this.data.length;
  }

  public setLocalUser(){
    this.usuarioSolicita = this.localStorage.getLocalUser();
    this.intercompania = this.usuarioSolicita.intercompania;
    if(!this.tienePermiso('select multiempresa asistencias')){
      this.getEmpleados(this.usuarioSolicita.intercompania);
    }
  }

}
