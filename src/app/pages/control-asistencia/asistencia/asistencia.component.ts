import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { AsistenciaService } from 'src/app/core/services/control-asistencia/asistencia.service';
import { EmpleadosService } from 'src/app/core/services/control-asistencia/empleados.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { modelFiltrado} from 'src/app/shared/constants/constantes-pv';
import { pmsParqueVehciular } from 'src/app/shared/constants/permisos';
import { ModalReporteComponent } from './modal-reporte/modal-reporte.component';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit {

  private routeSub!: Subscription;
  concepto:any = '';
  public empresas: any;
  public rawEmpresas: any;
  public isLoading: boolean = true;
  public isLoad: boolean = false;
  public mostrar: boolean = false;
  public datosFiltrados: any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda: string = "";
  modelFiltrado = modelFiltrado;
  public totalDatos: any;
  public totalDatosFiltrados: any;
  public data: any;
  public permisos = pmsParqueVehciular;
  public intercompania: any = null;
  public showTable: boolean = false;

  public fechaConsulta: any;
  public fechaInicial: any;
  public modalAbierto: boolean = false;
  public modalRef?: BsModalRef;

  constructor(
    private asistenciaService: AsistenciaService,
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
      this.getEmpresas();
    });
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

  /**
   * Recupera el reporte de asistencia por empresa del dia en curso
   */
  public getReporteAsistenca(intercompania:any) {

    this.mostrar = true;
    this.intercompania = intercompania;

    this.asistenciaService.getAll(intercompania).subscribe(
      (response) => {
        if (response) {          
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.data = response.data;
          this.fechaConsulta = this.data.date;
          this.fechaInicial = this.data.date;          
          
          this.isLoading = false;
          this.showTable = true;
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

  public filtrarPorFecha() {
    this.mostrar = true;
    
    this.asistenciaService.getDate(this.intercompania, this.fechaConsulta).subscribe(
      (response) => {
        if (response) {          
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.data = response.data;
          this.fechaConsulta = this.data.date
        
          this.isLoading = false;
          this.showTable = true;
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

  public modalDescarga (){
    this.modalAbierto = true;
          const initialState: ModalOptions = {
            initialState: {
              intercompania: this.intercompania 
            },
            class: "modal-sm",
          };
          this.modalRef = this.modalService.show(
            ModalReporteComponent,
            initialState
          );
          this.modalRef.content.closeBtnName = "Close";
          this.modalRef.content.event.subscribe(() => {
            this.isLoad = true;
            //this.getEmpleados(this.usuarioSolicita.intercompania);
          });
          this.modalRef.content.modalCerrado.subscribe(() => {
            this.modalAbierto = false;
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

}
