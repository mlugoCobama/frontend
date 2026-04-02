import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { firstValueFrom } from 'rxjs';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ConcentradoComisionesService } from 'src/app/core/services/renault/concentrado-comisiones.service';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-detalle-rubro',
  templateUrl: './modal-detalle-rubro.component.html',
  styleUrl: './modal-detalle-rubro.component.css'
})
export class ModalDetalleRubroComponent implements  OnInit, AfterViewInit {

  @Input() data: any = [];
  @Input() vendedores: any = null;
  public idVendedor = null;
  public nombreVendedor = null;
  public nroVendedor = null;
  public rubro = null;
  public isLoad = false;

  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;

columnasVendedor = [
      { campo: "descripcion",   etiqueta: "Descripcion", bold: true},
      { campo: "observaciones", etiqueta: "Observaciones"},
      { campo: "importe_venta", etiqueta: "Importe", pipe: "currency",   align:'right'},
      { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency",   align:'right', bold: true},
    ];

      public accionesTabla: any[] = [
    {
      icono:   'fas fa-backward',
      clase:   'btn-warning',
      tooltip: 'Devolver al estado anterior',
      // Solo si NO está en el primer estado ni pagada
      visible: (item) => item.estatus > 1 && item.estatus !== 3,
      accion:  async (item) => await this.devolver(item),
    },
    // {
    //   icono:   'fas fa-eye',
    //   clase:   'btn-secondary',
    //   tooltip: 'Ver documento de soporte',
    //   // Solo si tiene archivo cargado
    //   visible: (item) => !!item.ruta_archivo,
    //   accion:  async (item) => await this.verDocumento(item),
    // },
  ];


  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private concentradoComisiones: ConcentradoComisionesService,
    private financiamientoService: FinanciamientoService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getAll(this.idVendedor, this.rubro)
  }


  cerrarModal(): void {
    this.bsModalRef.hide();
  }

    private getAll(idVendedor, rubro) {
    this.isLoad = true;
    this.concentradoComisiones.getDetalleRubro(idVendedor, rubro).subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      },
    );
  }

   async devolver(row: any): Promise<void> {
      const { value: razon, isConfirmed } = await Swal.fire({
        title:            'Va a devolver esta partida al estado anterior',
        text:             'Agrega la razón del porqué está regresando',
        input:            'textarea',
        inputPlaceholder: 'Escribe la razón aquí...',
        showCancelButton:  true,
        confirmButtonText: 'Enviar',
        cancelButtonText:  'Cancelar',
        reverseButtons:    true,
        customClass: {
          confirmButton: 'btn btn-primary m-1',
          cancelButton:  'btn btn-secondary m-1'
        },
        buttonsStyling: false,
        inputValidator: (value) => {
          if (!value) return 'El campo es obligatorio';
          return null;
        }
      });
  
      if (!isConfirmed || !razon) return;
  
      const response: any = await firstValueFrom(
        this.concentradoComisiones.devolverPartida(row.id, { comentario: razon, rubro : this.rubro, estatus: row.estatus})
      );
  
      if (response.status === 'success') {
        this.alertas.mostrarAlerta('Listo', response.message, 'success', 'success');
        this.removerFila(row.id);
        this.recalcular()
      } else {
        this.alertas.mostrarAlerta('Error', response.message, 'error', 'danger');
      }
    }

        /** Remueve la fila de tabla y del from array */
  removerFila(index: number) {
    let indice = this.data.findIndex(p => p.id === index);

    if (indice !== -1) {
      this.data.splice(indice, 1);
      this.data = [...this.data]; 
    }
  }

  recalcular(){
    this.event.emit()
  }
}
