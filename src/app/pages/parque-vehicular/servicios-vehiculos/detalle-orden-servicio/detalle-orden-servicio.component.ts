import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProveedorOption } from './proveedor-selector/proveedor-selector.component';
import { ProveedoresVehiculosService } from 'src/app/core/services/parque-vehicular/proveedores-vehiculos.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { OrdenServicioService } from 'src/app/core/services/parque-vehicular/orden-servicio.service';

export const TIPO_EVENTO = {
  ESP_ASIGNACION: 1,
  ASIGNADO: 2,
  DIAGNOSTICO : 3,
  POR_AUTORIZAR : 4,
  EN_PROCESO: 5,
  TERMINADO: 6,
  ENTREGADO: 7,
  FINALIZADO: 8,
};

@Component({
  selector: 'app-detalle-orden-servicio',
  templateUrl: './detalle-orden-servicio.component.html',
  styleUrl: './detalle-orden-servicio.component.css'
})

export class DetalleOrdenServicioComponent  implements OnInit{
  @Input() cita: any;
  @Output() setActiveCita = new EventEmitter<any>();
  @Output() reload = new EventEmitter<any>();

  public isLoading : boolean = true;
  public sending : boolean = false;
  public dataOrdenServicio!:any;

    public catEventos = [
      { id: 1, nombre: "Esp. Asignacion"},
      { id: 2, nombre: "Asignado"       },
      { id: 3, nombre: "En Diagnostico" },
      { id: 4, nombre: "Por Autorizar"  },
      { id: 5, nombre: "En Reparacion"  },
      { id: 6, nombre: "Terminado"      },
      { id: 7, nombre: "Entregados"     },
      { id: 8, nombre: "Finalizado"     },
    ];

    public eventosEstado: { [tipoEvento: number]: any | null } = {
      [TIPO_EVENTO.ESP_ASIGNACION]: null,
      [TIPO_EVENTO.ASIGNADO]: null,
      [TIPO_EVENTO.DIAGNOSTICO]: null,
      [TIPO_EVENTO.POR_AUTORIZAR]: null,
      [TIPO_EVENTO.EN_PROCESO]: null,
      [TIPO_EVENTO.TERMINADO]: null,
      [TIPO_EVENTO.ENTREGADO]: null,
      [TIPO_EVENTO.FINALIZADO]: null,
    };

  constructor(
    private proVehiculoService:ProveedoresVehiculosService,
    private alertasService:SwalComprsServiceService,
    private ordenServicio: OrdenServicioService,
  ){}

  goBack() {
    this.setActiveCita.emit(false);
    this.reload.emit();
    // this.router.navigate(['/renault/ordenes-servicio']);
  }

  ngOnInit(): void {
    this.getDetalleOrden();
    // console.log(this.listaProveedores)

  }

  @Input() listaProveedores: ProveedorOption[] = [];
  guardandoAsignacion: boolean = false;

// Método para procesar la asignación
asociarProveedorAVehiculo(proveedorId: number): void {
  this.guardandoAsignacion = true;

  const payload = {
    // vehiculo_id: this.itemVehiculo.id,
    proveedor_id: proveedorId
  };

  this.proVehiculoService.update(this.cita?.id, payload).subscribe({
      next: (res) => {
        if(res.status == 'success'){
          this.alertasService.mostrarAlerta('Listo', res.message, 'success', 'success');
          this.guardandoAsignacion = false;
          this.reload.emit();
          this.getDetalleOrden();
        }else{
          this.alertasService.mostrarAlerta('Error', res.message, 'error', 'error');
          this.guardandoAsignacion = false;
        }
      },
      error: (err) => {
        this.guardandoAsignacion = false;
        this.alertasService.mostrarAlerta('Error', err, 'error', 'error');
      }
    });
  }

  private getDetalleOrden() {
    this.isLoading = true;
    this.ordenServicio.getOne(this.cita?.id).subscribe(
          (response) => {
            if (response.status = 'success') {
              console.log(response.data)
              this.dataOrdenServicio = response.data?.proveedor_asignado;
              this.cargarEventosCita();
              this.isLoading = false;
            } else {
              this.isLoading = false;
              console.log(response.message);
            }
          },
          (error) => {
            this.isLoading = false;
            console.error("Error fetching data:", error);
          }
        );
  }

  public cargarEventosCita(): void {
    if (this.dataOrdenServicio?.eventos) {
      this.dataOrdenServicio.eventos.forEach((evento: any) => {
        this.eventosEstado[evento.pv_cat_eventos_id] = evento;
      });
    }
  }

  public async autorizarOrden(tipo:any){
    console.log(this.dataOrdenServicio)
    this.sending = true;
    const confirmado = await this.alertasService.mostrarConfirmacion('Ya casi!', `Estas seguro que deseas ${tipo} esta orden de servicio`)

    if (!confirmado) {
      this.sending = false;
      return;
    }

    const payload = {
      idOrdenProv: this.dataOrdenServicio?.id,
      idOrdenServicio : this.dataOrdenServicio?.pv_orden_servicio_id,
      accion: tipo
    };

    this.ordenServicio.autorizar(payload).subscribe(
      (response) => {
        if (response.status = 'success') {
          this.alertasService.mostrarAlerta('Listo', response.message, 'success', 'success')
          this.sending = false;
          this.getDetalleOrden();
        } else {
          this.sending = false;
          console.log(response.message);
        }
      },
        (error) => {
          this.sending = false;
          console.error("Error fetching data:", error);
      }
    );
  }


  public async finalizar(){
    this.sending = true;
    const confirmado = await this.alertasService.mostrarConfirmacion('Ya casi!', `Estas seguro que deseas finalizar esta orden de servicio`)

    if (!confirmado) {
      this.sending = false;
      return;
    }

    const payload = {
      idOrdenProv: this.dataOrdenServicio?.id,
      idOrdenServicio : this.dataOrdenServicio?.pv_orden_servicio_id
    };

    this.ordenServicio.finalizar(payload).subscribe(
      (response) => {
        if (response.status = 'success') {
          this.alertasService.mostrarAlerta('Listo', response.message, 'success', 'success')
          this.sending = false;
          this.getDetalleOrden();
        } else {
          this.sending = false;
          console.log(response.message);
        }
      },
        (error) => {
          this.sending = false;
          console.error("Error fetching data:", error);
      }
    );
  }
}
