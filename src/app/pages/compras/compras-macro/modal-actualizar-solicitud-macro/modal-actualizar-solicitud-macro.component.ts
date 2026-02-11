import { AfterViewInit, Component,  EventEmitter,  ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';

import { FormDetalleSolicitudComponent } from '../../forms-solicitud/form-detalle-solicitud/form-detalle-solicitud.component';
import { FormSolicitudMacroComponent } from '../../forms-solicitud/form-solicitud-macro/form-solicitud-macro.component';
import { SelectSistemaMantenimientoComponent } from '../select-sistema-mantenimiento/select-sistema-mantenimiento.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
@Component({
  selector: "app-modal-actualizar-solicitud-macro",
  templateUrl: "./modal-actualizar-solicitud-macro.component.html",
  styleUrl: "./modal-actualizar-solicitud-macro.component.css",
})
export class ModalActualizarSolicitudMacroComponent {
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild("formSolicitudMacro", { static: false })
  formSolicitudCompra!: FormSolicitudMacroComponent;
  @ViewChild("formDetalleSolicitud", { static: false })
  tableData!: FormDetalleSolicitudComponent;
  @ViewChild("formSelectsSistemaManteniemiento", { static: false })
  formSelectsSistemaManteniemiento!: SelectSistemaMantenimientoComponent;

  public submitted: boolean = false;
  public submittedDetail: boolean = false;
  public isLoad: boolean = false;
  public sending: boolean = false;
  public autotanques: any = [];
  public destino: any = null;

    public solicitudCompra;
  public detalles;

  constructor(
    public modalRef: BsModalRef,
    public alertasService: SwalComprsServiceService,
    public comprasMacro: ComprasMacroService,
    public comprasService: ComprasService,
    public permisosService: PermisosService
  ) {}

  ngAfterViewInit() {
    this.getDetalles();
  }

  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
  
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

    let data;
    if(this.tienePermiso('view form tipo mantenimiento')){
      data = {
        idSolicitud : this.solicitudCompra.id,
        ...this.formSolicitudCompra.obtenerValores(),
        ...this.formSelectsSistemaManteniemiento.obtenerValores(),
        usuario_solicita: this.solicitudCompra.usuario_solicita_id,
        detalles: this.tableData.getDetalles(),
      };
    }else{
      data = {
        ...this.formSolicitudCompra.obtenerValores(),
        usuario_solicita: this.solicitudCompra.usuario_solicita_id,
        detalles: this.tableData.getDetalles(),
        idSolicitud : this.solicitudCompra.id,
      };
    }
    

    // if(!this.formSolicitudCompra.getIsAgencia()){
    //   data.c_c = 0;
    // }
    
    // if (this.formSolicitudCompra.getIsAgencia()) {
    //   data.usuario_destino = this.formSolicitudCompra.obtenerUsuarios();
    // }

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
    this.comprasMacro.updateSolicitud(formDataToSend).subscribe(
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

    public getDetalles() {
    this.isLoad = true;
    this.comprasService.getOne(this.solicitudCompra?.id).subscribe(
      (response) => {
        if (response) {
          this.detalles = response.data
            if(this.detalles){
              // console.log(this.detalles)
              this.formSolicitudCompra.setValues();
              this.tableData.loadDetallesFromDB(this.detalles);

                this.formSelectsSistemaManteniemiento.habilitarCampos();
            }

          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta("Error!",response.message, "error", "danger" );
          this.isLoad = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger" );
        this.isLoad = false;
      }
    );
  }

    getData(data:any) {
    this.autotanques = data.slice(1);
  }

  getDato(dato:any) {
    this.destino = dato;
    this.tableData.limpiarArray();
    this.tableData.setVehiculoValidator(dato);
  }
}
