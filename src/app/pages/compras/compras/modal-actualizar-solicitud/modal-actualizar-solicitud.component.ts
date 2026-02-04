import { Component, ViewChild, EventEmitter } from '@angular/core';
import { FormSolicitudComponent } from '../../forms-solicitud/form-solicitud/form-solicitud.component';
import { FormDetalleSolicitudComponent } from '../../forms-solicitud/form-detalle-solicitud/form-detalle-solicitud.component';
import { SelectSistemaMantenimientoComponent } from '../../compras-macro/select-sistema-mantenimiento/select-sistema-mantenimiento.component';
import catCentrosCostos from "src/environments/cat_centros_costos.json";
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-modal-actualizar-solicitud',
  templateUrl: './modal-actualizar-solicitud.component.html',
  styleUrl: './modal-actualizar-solicitud.component.css'
})


export class ModalActualizarSolicitudComponent {
  public isLoading: boolean = true;
  public submittedDetail: boolean = false;
  public isLoad: boolean = false;
  public showTable: boolean = false;
  public submitted: boolean = false;
  public disabled: boolean = false;
  public sending: boolean = false;

  public centrosCostos = catCentrosCostos;

  public solicitudCompra;
  public detalles;

  @ViewChild('formSolicitud', { static: false }) formSolicitudCompra!:  FormSolicitudComponent;
  @ViewChild('formDetalleSolicitud', { static: false }) tableData!:  FormDetalleSolicitudComponent;
  @ViewChild('formSelectsSistemaManteniemiento ', { static: false }) formSelectsSistemaManteniemiento!: SelectSistemaMantenimientoComponent;
  public event: EventEmitter<any> = new EventEmitter();
  constructor(
      private alertasService: SwalComprsServiceService,
      private comprasService: ComprasService,
      private permisosService: PermisosService,
      public modalRef: BsModalRef
    ) {}
  
    // public ngOnInit(): void {
  
    // }
     public ngAfterViewInit(): void {
      this.getDetalles();
      
     }

    /**
   * cierra la ventana modal
   */
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
    this.comprasService.updateSolicitud(formDataToSend).subscribe(
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
              if(this.tienePermiso('view form tipo mantenimiento') && this.solicitudCompra.tipo == 3){
                this.formSelectsSistemaManteniemiento.habilitarCampos();
              }
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

}
