import { Component, OnInit } from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { OrdenesServicioService } from 'src/app/core/services/renault/ordenes-servicio.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-ordenes-servicio',
  templateUrl: './ordenes-servicio.component.html',
  styleUrl: './ordenes-servicio.component.css'
})
export class OrdenesServicioComponent implements OnInit{

  public indicadores = [
    { label: 'Entrada', number: 11, className: 'alert alert-primary m-0 p-2', color:'primary',  nombre: 'Entrada', },
    { label: 'Taller', number: 11, className: 'alert alert-warning m-0 p-2', color:'warning', nombre: 'Taller', },
    { label: 'Lavado', number: 11, className: 'alert alert-info m-0 p-2', color:'info', nombre: 'Lavado', },
    { label: 'Calidad', number: 11, className: 'alert alert-dark m-0 p-2', color:'dark', nombre: 'Calidad', },
    { label: 'Terminado', number: 11, className: 'alert alert-success m-0 p-2', color:'primary', nombre: 'Terminado', },
    { label: 'Entregado', number: 11, className: 'alert alert-success m-0 p-2', color:'success', nombre: 'Entregado', },
  ];

  agrupaciones = {
    'Entrada': ['AC'],
    'Taller': ['AT'],
    'Lavado': [''],
    'Calidad': [''],
    'Entregado' : [''],
  };

  public ordenesServicio:any = [];
  datosAgrupados: { [key: string]: any[] } = {};

  public isLoad: boolean = false;

  public activeCita:boolean = false;
  public citaSeleccionada:any = [];

  constructor(
    private ordenesServicioService: OrdenesServicioService,
    private localStorage: LocalStorageServiceService,
    private permisosService:PermisosService,
  ){}

  ngOnInit(): void {
    this.getAll(this.getUsuarioActivo().intercompania);
  }

  public getAll(intercompania:any) {
    this.isLoad = false;
    this.ordenesServicioService.getAll(intercompania).subscribe(data => {
      if (data.status) {
        this.ordenesServicio = data.data;
        this.agruparPorEstadoTexto();
        this.isLoad = true;
      } else {
        console.log(data.message);
        this.isLoad = false;
      }
    },(error) => {
      console.error("Error fetching data:", error);
      this.isLoad = false;
    });
  }

  public getFilter(data) {
    this.isLoad = false;
    this.ordenesServicioService.getDataFilter(data.agencia, data.aps, data.fechaInicio, data.fechaFin).subscribe(data => {
      if (data.status) {
        this.ordenesServicio = data.data;
        this.agruparPorEstadoTexto();
        this.isLoad = true;
      } else {
        console.log(data.message);
        this.isLoad = false;
      }
    },(error) => {
      console.error("Error fetching data:", error);
      this.isLoad = false;
    });
  }


    agruparPorEstadoTexto() {
      this.datosAgrupados = {};
      Object.keys(this.agrupaciones).forEach((grupo) => {
        const nombres = this.agrupaciones[grupo];
        this.datosAgrupados[grupo] = this.ordenesServicio.filter((d) =>
          nombres.includes(d.estatus)
        );
      });
    }

    public setCitaSeleccionada(cita){
      this.setActiveCita(true);
      this.citaSeleccionada =  cita;
    }

    public setActiveCita(valor){
      this.activeCita = valor;
    }

  getUsuarioActivo(){
    const usuarioActual = this.localStorage.getItem('currentUser');
    return usuarioActual['role']
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

}
