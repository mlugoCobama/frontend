import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';
import { BiometricosService } from 'src/app/core/services/control-asistencia/biometricos.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-biometricos',
  templateUrl: './biometricos.component.html',
  styleUrl: './biometricos.component.css'
})
export class BiometricosComponent implements OnInit{

  public data: any;

  public showTable: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;

  //Variables funciones tablas
  datosFiltrados: any[] = [];
  private modelFiltrado :any[] = ['name', 'serial_number', 'ip_address', 'mac_address','status', 'last_heartbeat']
  private ordenador!: FuncionesTablas<any>;
  busqueda: string = "";

  constructor(
      private biometricosSerivce: BiometricosService,
      private modalService: BsModalService,
      private permisosService: PermisosService
    ) {}

  public ngOnInit(): void {
    this.getAll();
  }

  //Recupera todos los registros de los proveedores
    private getAll() {
      this.biometricosSerivce.getAll().subscribe(
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

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  filtrarTabla() {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, this.modelFiltrado);
    // this.contarDatos();
  }
}
