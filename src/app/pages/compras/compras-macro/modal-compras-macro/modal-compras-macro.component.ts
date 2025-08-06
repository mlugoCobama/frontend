import { AfterViewInit, Component,  EventEmitter,  ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';
import { FormDetalleSolicitudComponent } from '../../forms-solicitud/form-detalle-solicitud/form-detalle-solicitud.component';
import { FormSolicitudMacroComponent } from '../../forms-solicitud/form-solicitud-macro/form-solicitud-macro.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';


@Component({
  selector: 'app-modal-compras-macro',
  templateUrl: './modal-compras-macro.component.html',
  styleUrl: './modal-compras-macro.component.css'
})
export class ModalComprasMacroComponent implements AfterViewInit {

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('formSolicitudMacro', { static: false }) formSolicitudCompra!:  FormSolicitudMacroComponent;
  @ViewChild('formDetalleSolicitud' , { static: false }) tableData!:  FormDetalleSolicitudComponent;

  public submitted: boolean = false;
  public submittedDetail: boolean = false;
  public isLoad : boolean = false;
  public sending: boolean = false;

  constructor(
    public modalRef: BsModalRef,
    public alertasService : SwalComprsServiceService,
    public comprasMacro : ComprasMacroService
  ){}


  ngAfterViewInit() {

  }


  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
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
        "Alerta",
        "Debes llenar correctamente todos los campos",
        "warning",
        "warning"
      );
      this.sending = false;
      return;
    }

    /**
     * Valido que el usuario ingrese por lo menos un detalle
     */
    if (!this.tableData.hasDatos()) {
      this.isLoad = false;
      this.alertasService.mostrarAlerta(
        "Alerta",
        "Agrega por lo menos un elemento a la solicitud",
        "warning",
        "warning"
      );
      this.sending = false;
      return;
    }

    const data = {
      ...this.formSolicitudCompra.obtenerValores(),
      usuario_solicita: this.formSolicitudCompra.obtenerUsuarios(),
      detalles: this.tableData.getDetalles(),
    };

    const archivosCotizacion = this.formSolicitudCompra.obtenerArchivos().get("cotizacion") as File
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

    formDataToSend.append('file_cotizacion', archivosCotizacion)
    
    this.comprasMacro.save(formDataToSend).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          // this.showTable = true;

          this.alertasService.mostrarAlerta(
            "Guardado",
            "Solicitud registrada correctamente",
            "success",
            "success"
          );

          this.tableData.limpiarArray();
          this.submitted = false;
          this.formSolicitudCompra.resetearFormulario();
          this.sending = false;
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

}
