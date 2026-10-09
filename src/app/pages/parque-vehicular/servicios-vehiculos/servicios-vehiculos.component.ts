import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAsignacionVehiculosComponent } from './modal-asignacion-vehiculos/modal-asignacion-vehiculos.component';
import { FiltrosOrdenServicio, ProveedoresVehiculosService } from 'src/app/core/services/parque-vehicular/proveedores-vehiculos.service';
import { ColumnaTabla } from 'src/app/shared/ui/tabla-generica/tabla-generica.component';
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { FiltroComponent } from './filtro/filtro.component';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';

@Component({
  selector: 'app-servicios-vehiculos',
  templateUrl: './servicios-vehiculos.component.html',
  styleUrl: './servicios-vehiculos.component.css'
})
export class ServiciosVehiculosComponent implements OnInit{
  public modalRef?: BsModalRef;
  public isLoad:boolean = false;
  public data:any;


  empresas: any[] = [];
  vehiculos: any[] = [];
  proveedores: any[] = [];

  loadingEmpresas:boolean = false;
  loadingVehiculos:boolean = false;
  loadingProveedores:boolean = false;

  public filtros = null;

  loadingFiltro:boolean = false

  public activeCita:boolean = false;
  public citaSeleccionada:any = [];

  datosAgrupados: { [key: string]: any[] } = {};

  datosFiltrados: any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda: string = "";
  public modelBusqueda = [ "folio","marca","submarca","placas","no_serie","fecha", "empresa"];

  public indicadores = [
    { label: 'Esp. Asignacion', number: 11, className: 'alert alert-primary m-0 p-2', color:'warning',  nombre: 'Esp. Asignacion'},
    { label: 'Asignado', number: 11, className: 'alert alert-warning m-0 p-2', color:'primary', nombre: 'Asignado'},
    { label: 'En Diagnostico', number: 11, className: 'alert alert-info m-0 p-2', color:'secondary', nombre: 'En Diagnostico'},
    { label: 'Por Autorizar', number: 11, className: 'alert alert-info m-0 p-2', color:'warning', nombre: 'Por Autorizar'},
    { label: 'En Reparacion', number: 11, className: 'alert alert-dark m-0 p-2', color:'dark', nombre: 'En Reparacion'},
    { label: 'Terminado', number: 11, className: 'alert alert-success m-0 p-2', color:'info', nombre: 'Terminado'},
    { label: 'Entregado', number: 11, className: 'alert alert-success m-0 p-2', color:'success', nombre: 'Entregado'},
    { label: 'Finalizada', number: 11, className: 'alert alert-success m-0 p-2', color:'dark', nombre: 'Finalizada'},
  ];

  agrupaciones = {
    'Esp. Asignacion': ['1'],
    'Asignado': ['2'],
    'En Diagnostico': ['3'],
    'Por Autorizar': ['4'],
    'En Reparacion': ['5'],
    'Terminado' : ['6'],
    'Entregado' : ['7'],
    'Finalizada' : ['8'],
  };

  @ViewChild('filtroOs') filtroOs!: FiltroComponent;

   constructor(
      private modalService: BsModalService,
      private proveedorVehiculos: ProveedoresVehiculosService,
      public usuariosService: UsuariosService,
      private alertasService: SwalComprsServiceService,
      public proveedoresService: ProveedoresService,
    ) {}

    ngOnInit(): void {
      this.cargarCatalogosIniciales();
    }

    ngAfterViewInit(): void {
      this.aplicarFiltros()
    }


    public openModalNuevo() {
      const initialState: ModalOptions = {
        initialState: {
          // intercompania: this.intercompania,
        empresas: this.empresas,
          // tipo: this.concepto
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalAsignacionVehiculosComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.getAll();
      });
    }

    private getAll() {
        this.isLoad = false;
        this.data = [];
        this.proveedorVehiculos.getAll().subscribe(
          (response) => {
            if (response.status = 'success') {
              this.data = response.data;
              this.agruparPorEstadoTexto();
              this.isLoad = true;
            } else {
              this.isLoad = true;
              console.log(response.message);
            }
          },
          (error) => {
            this.isLoad = false;
            console.error("Error fetching data:", error);
          }
        );


      }

    agruparPorEstadoTexto() {
      this.datosAgrupados = {};
      Object.keys(this.agrupaciones).forEach((grupo) => {
        const nombres = this.agrupaciones[grupo];
        this.datosAgrupados[grupo] = this.datosFiltrados.filter((d:any) =>
          nombres.includes(d.estatus)
        );
      });
    }


    private cargarCatalogosIniciales(): void {
    // Cargar Empresas
    this.loadingEmpresas = true;

    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data;
          this.empresas = this.usuariosService.filtrarEmpresasGseras(rawData, [200, 119, 201, 700, 333, 119, 2000 ]);
          this.loadingEmpresas = false;
        } else {
          this.loadingEmpresas = false;
          this.alertasService.mostrarAlerta(
            "Error",response.message,
            "error","danger"
          );
        }
      },
      (error) => {
        this.loadingEmpresas = false;
        this.alertasService.mostrarAlerta(
          "Error",`Error fetching data: ${error}`,
          "error","danger"
        );
      }
    );

    this.loadingProveedores = true;
    this.proveedoresService.getProveedores().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;
          this.loadingProveedores = false;
        } else {
          this.loadingProveedores = false;
          this.alertasService.mostrarAlerta(
            "Error!", response.message,
            "error","danger"
          );
        }
      },
      (error) => {
        this.loadingProveedores = false;
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      }
    );
  }

    public setCitaSeleccionada(cita:any){
      this.setActiveCita(true);
      this.citaSeleccionada =  cita;
    }

    public setActiveCita(valor:any){
      this.activeCita = valor;
    }

  aplicarFiltros(): void {
    // const misFiltros = this.filtroOs.filtroForm.getRawValue();
    this.cargarOrdenes();
  }

  cargarOrdenes(filtros?: FiltrosOrdenServicio): void {

    this.loadingFiltro = true;
    this.isLoad = false;

    this.proveedorVehiculos.getOrdenesServicio(filtros).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.data = response.data;
          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];
          this.agruparPorEstadoTexto();
          this.isLoad = true;
          this.loadingFiltro = false;
          // this.ordenes = response.data;
        }
      },
      error: (err) => console.error('Error al recuperar ordenes', err)
    });
  }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, this.modelBusqueda);
    this.agruparPorEstadoTexto();
  }

}
