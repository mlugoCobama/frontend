import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { firstValueFrom } from 'rxjs';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ConcentradoComisionesService } from 'src/app/core/services/renault/concentrado-comisiones.service';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-modal-detalle-rubro",
  templateUrl: "./modal-detalle-rubro.component.html",
  styleUrl: "./modal-detalle-rubro.component.css",
})
export class ModalDetalleRubroComponent implements OnInit, AfterViewInit {
  @Input() data: any = [];
  @Input() vendedores: any = null;
  public idVendedor = null;
  public nombreVendedor = null;
  public nroVendedor = null;
  public rubro = null;
  public isLoad = false;

  public event: EventEmitter<any> = new EventEmitter();
  public loading = false;

  columnasVendedor:any = [];

  public accionesTabla: any[] = [
    {
      icono: "fas fa-backward",
      clase: "btn-warning",
      tooltip: "Mover a pendiente",
      // Solo si estan autorizadas
      visible: (item:any) => item.estatus == 3,
      accion: async (item:any) => await this.devolver(item),
    },
    {
      icono: "fas fa-check",
      clase: "btn-primary",
      tooltip: "Agregar a este corte",
      // Solo si están pendientes
      visible: (item:any) => item.estatus == 2,
      accion: async (item:any) => await this.autorizar(item),
    },
    {
      icono: "fas fa-backward",
      clase: "btn-warning",
      tooltip: "Mover a pendiente",
      // Solo si estan autorizadas
      visible: (item:any) =>
        item.estatus == 4 &&
        (this.rubro == "nuevos" || this.rubro == "seminuevos"),
      accion: async (item:any) => await this.devolver(item),
    },
    {
      icono: "fas fa-check",
      clase: "btn-primary",
      tooltip: "Agregar a este corte",
      // Solo si están pendientes
      visible: (item:any) =>
        item.estatus == 6 &&
        (this.rubro == "nuevos" || this.rubro == "seminuevos"),
      accion: async (item:any) => await this.autorizar(item),
    },
  ];

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private concentradoComisiones: ConcentradoComisionesService,
    private financiamientoService: FinanciamientoService,
  ) {}

  ngOnInit(): void {
    this.columnasVendedor = this.setTableRubro(this.rubro)
  }

  ngAfterViewInit(): void {
    this.getAll(this.idVendedor, this.rubro);
  }

  cerrarModal(): void {
    this.bsModalRef.hide();
  }

  public autorizadas: any = [];
  public pendientes: any = [];

  private getAll(idVendedor:any, rubro:any) {
    this.pendientes = [];
    this.autorizadas = [];
    this.isLoad = true;
    this.concentradoComisiones.getDetalleRubro(idVendedor, rubro).subscribe(
      (response: any) => {
        if (response) {
          // this.data = response.data;
          this.autorizadas = response.data.autorizadas;
          this.pendientes = response.data.pendientes;
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
      title: "Va a devolver esta partida al estado anterior",
      text: "Agrega la razón del porqué está regresando",
      input: "textarea",
      inputPlaceholder: "Escribe la razón aquí...",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary m-1",
        cancelButton: "btn btn-secondary m-1",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value) return "El campo es obligatorio";
        return null;
      },
    });

    if (!isConfirmed || !razon) return;

    const response: any = await firstValueFrom(
      this.concentradoComisiones.devolverPartida(row.id, {
        comentario: razon,
        rubro: this.rubro,
        estatus: row.estatus,
      }),
    );

    if (response.status === "success") {
      this.alertas.mostrarAlerta(
        "Listo",
        response.message,
        "success",
        "success",
      );
      this.removerFila(row.id);
      this.getAll(this.idVendedor, this.rubro);
      this.recalcular();
    } else {
      this.alertas.mostrarAlerta("Error", response.message, "error", "danger");
    }
  }

  /** Remueve la fila de tabla y del from array */
  removerFila(index: number) {
    let indice = this.data.findIndex((p:any) => p.id === index);

    if (indice !== -1) {
      this.data.splice(indice, 1);
      this.data = [...this.data];
    }
  }

  get totalAutorizado(): number {
    return this.autorizadas.reduce(
      (acc:any, item:any) => acc + (Number(item?.comision_apv) || 0),
      0,
    );
  }

  get totalPendiente(): number {
    return this.pendientes.reduce(
      (acc:any, item:any) => acc + (Number(item?.comision_apv) || 0),
      0,
    );
  }

  recalcular() {
    this.event.emit();
  }

  async autorizar(row: any): Promise<void> {
    const { isConfirmed } = await Swal.fire({
      title:
        "Esta partida pasará a autorizadas y tu comisión se sumará al total del corte.",
      text: "¿Seguro que quieres continuar?",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary m-1",
        cancelButton: "btn btn-secondary m-1",
      },
      buttonsStyling: false,
    });

    if (!isConfirmed) return;

    const response: any = await firstValueFrom(
      this.concentradoComisiones.autorizarPartida(row.id, {
        rubro: this.rubro,
        estatus: row.estatus,
      }),
    );

    if (response.status === "success") {
      this.alertas.mostrarAlerta(
        "Listo",
        response.message,
        "success",
        "success",
      );
      this.removerFila(row.id);
      this.getAll(this.idVendedor, this.rubro);
      this.recalcular();
    } else {
      this.alertas.mostrarAlerta("Error", response.message, "error", "danger");
    }
  }

  public setTableRubro(rubro:any){

    
  switch (rubro) {
    case 'otros':
      return this.catalogoTablas.talaDefault;
    case 'nuevos':
      return this.catalogoTablas.talaVentaVehiculos;
    case 'seminuevos':
      return this.catalogoTablas.talaVentaVehiculos;
    case 'financiamiento':
      return this.catalogoTablas.talaFinanciamiento;
    case "toma_de_unidades":
      return this.catalogoTablas.talaTomaUnidad;
    case 'seguros':
      return this.catalogoTablas.talaSeguros;
    case 'Accesorios':
      return this.catalogoTablas.talaDefault;
    default:
      return this.catalogoTablas.talaDefault;
  }
  }

  public catalogoTablas = {
    talaDefault : [
    { campo: "descripcion", etiqueta: "Descripcion", bold: true },
    { campo: "observaciones", etiqueta: "Observaciones" },
    { campo: "importe_venta", etiqueta: "Importe",  pipe: "currency", align: "right"},
    { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency", align: "right", bold: true},
  ],

  talaVentaVehiculos : [
    { campo: "factura", etiqueta: "Factura", bold: true },
    { campo: "descripcion", etiqueta: "Descripcion", bold: true },
    { campo: "inventario", etiqueta: "Inventario", bold: true },
    { campo: "observaciones", etiqueta: "Observaciones" },
    { campo: "importe_venta", etiqueta: "Importe",  pipe: "currency", align: "right"},
    { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency", align: "right", bold: true},
  ],

   talaFinanciamiento : [
    { campo: "numero_factura", etiqueta: "Factura", bold: true },
    { campo: "descripcion", etiqueta: "Descripcion", bold: true },
    { campo: "fecha_desembolso", etiqueta: "Fecha D", bold: true, pipe:'date'},
    { campo: "observaciones", etiqueta: "Observaciones" },
    { campo: "importe_venta", etiqueta: "Importe",  pipe: "currency", align: "right"},
    { campo: "vf3", etiqueta: "VF3",  pipe: "currency", align: "right"},
    { campo: "garantia_ext", etiqueta: "Garantia Ext",  pipe: "currency", align: "right"},
    { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency", align: "right", bold: true},
  ],

  talaTomaUnidad : [
    { campo: "inventario", etiqueta: "Inventario", bold: true },
    { campo: "fecha", etiqueta: "Fecha", bold: true, pipe:'date'},
    { campo: "descripcion", etiqueta: "Descripcion", bold: true },
    { campo: "observaciones", etiqueta: "Observaciones" },
    { campo: "importe_venta", etiqueta: "Importe",  pipe: "currency", align: "right"},
    { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency", align: "right", bold: true},
  ],

   talaSeguros : [
    { campo: "folio", etiqueta: "Folio", bold: true },
    { campo: "fecha", etiqueta: "Fecha", bold: true, pipe:'date'},
    { campo: "descripcion", etiqueta: "Descripcion", bold: true },
    { campo: "observaciones", etiqueta: "Observaciones" },
    { campo: "importe_venta", etiqueta: "Importe",  pipe: "currency", align: "right"},
    { campo: "comision_apv",  etiqueta: "Comision APV", pipe: "currency", align: "right", bold: true},
  ],
  }
}
