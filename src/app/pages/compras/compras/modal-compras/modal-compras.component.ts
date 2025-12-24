import { Component, Input, OnInit, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

import { FormDetalleSolicitudComponent } from "../../forms-solicitud/form-detalle-solicitud/form-detalle-solicitud.component";
import { FormSolicitudComponent } from "../../forms-solicitud/form-solicitud/form-solicitud.component";
import { SelectSistemaMantenimientoComponent } from "../../compras-macro/select-sistema-mantenimiento/select-sistema-mantenimiento.component";

import { PermisosService } from 'src/app/core/services/permisos.service';



import catCentrosCostos from "src/environments/cat_centros_costos.json";
@Component({
  selector: "app-modal-compras",
  templateUrl: "./modal-compras.component.html",
  styleUrls: ["./modal-compras.component.css"],
})
export class ModalComprasComponent implements AfterViewInit
 {
  
  public isLoading: boolean = true;
  public submittedDetail: boolean = false;
  public isLoad: boolean = false;
  public showTable: boolean = false;
  public submitted: boolean = false;
  public disabled: boolean = false;
  public sending: boolean = false;

  public centrosCostos = catCentrosCostos;

  @ViewChild('formSolicitud', { static: false }) formSolicitudCompra!:  FormSolicitudComponent;
  @ViewChild('formDetalleSolicitud', { static: false }) tableData!:  FormDetalleSolicitudComponent;
  @ViewChild('formSelectsSistemaManteniemiento ', { static: false }) formSelectsSistemaManteniemiento!: SelectSistemaMantenimientoComponent;

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  /**
   * variable para regresar el evento
   */
  constructor(
    private alertasService: SwalComprsServiceService,
    private comprasService: ComprasService,
    private permisosService: PermisosService,
    public modalRef: BsModalRef
  ) {}

  // public ngOnInit(): void {

  // }
   public ngAfterViewInit(): void {
    
   }

  /**
   * Guarda el contenido del la solicitud y detalles
   * @returns
   */
  public save() {
    this.submitted = true;
    this.isLoad = true;
    this.sending = true;

    if (!this.formSolicitudCompra.esValido()) {
      this.isLoad = false;

      this.alertasService.mostrarAlerta(
        "Alerta", `Debes llenar correctamente todos los campos: ${this.formSolicitudCompra.mostrarErroresFormulario()}` ,
        "warning", "warning");
      this.sending = false;
      return;
    }

    if(this.tienePermiso('view form tipo mantenimiento') && !this.formSelectsSistemaManteniemiento.esValido()){
      this.alertasService.mostrarAlerta(
        "Alerta", `Debes llenar correctamente los campos de tipo de mantenimiento y sistema` ,
        "warning", "warning");
      this.sending = false;
      return;
    }

    /**
     * Valido que el usuario ingrese por lo menos un detalle
     */
    if (!this.tableData.hasDatos()) {
      this.isLoad = false;

      this.alertasService.mostrarAlerta(
        "Alerta", "Agrega por lo menos un elemento a la solicitud",
        "warning", "warning"
      );
      this.sending = false;
      return;
    }

    const data = {
      ...this.formSolicitudCompra.obtenerValores(),
      ...this.formSelectsSistemaManteniemiento.obtenerValores(),
      usuario_solicita: this.formSolicitudCompra.obtenerUsuarios(),
      detalles: this.tableData.getDetalles(),
    };

    if(!this.formSolicitudCompra.getIsAgencia()){
      data.c_c = 0;
    }
    
    if (this.formSolicitudCompra.getIsAgencia()) {
      data.usuario_destino = this.formSolicitudCompra.obtenerUsuarios();
    }

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));

    //agrega los detalles al form data para enviarlos
    this.tableData.getDetalles().forEach((detalle, index) => {
      if (detalle.img_referencia) {
        formDataToSend.append(
          `img_referencia_${index}`,
          detalle.img_referencia
        );
      }
    });

    this.comprasService.save(formDataToSend).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          // this.showTable = true;

          this.alertasService.mostrarAlerta("Guardado", "Solicitud registrada correctamente","success","success");
          this.tableData.limpiarArray();
          this.submitted = false;
          this.sending = false;
          this.formSolicitudCompra.resetearFormulario();
          this.cerrarModal();
        } else {
          this.alertasService.mostrarAlerta("Error", response.message, "warning", "warning");
          this.sending = false;
          return;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", error, "warning", "warning");
        this.sending = false;
        return;
      }
    );

    
  }

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}
