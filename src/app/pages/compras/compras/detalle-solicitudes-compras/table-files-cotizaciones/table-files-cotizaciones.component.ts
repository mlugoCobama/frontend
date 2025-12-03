import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { UsuariosService } from 'src/app/core/services/compras/usuarios.service';
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import {FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { EstadoSolicitud } from '../../estado-solicitud.enum';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { FormDatosEntregaOcComponent } from '../form-datos-entrega-oc/form-datos-entrega-oc.component';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-table-files-cotizaciones",
  templateUrl: "./table-files-cotizaciones.component.html",
  styleUrl: "./table-files-cotizaciones.component.css",
})
export class TableFilesCotizacionesComponent implements AfterViewInit {
  @ViewChild("formDatosOC", { static: false })
  formDatosOC!: FormDatosEntregaOcComponent;
  public sending: boolean = false;

  @Input() solicitudCompra: any = {};
  @Input() cotProv: any = [];
  @Input() detalles: any = [];
  @Input() mostrarObs: any = [];
  @Input() ordenCompra: any = {};
  @Input() saving: any = false;

  @Input() tipo: any = null;
  // @Input() isLoad: any;

  @Output() savePrices = new EventEmitter<void>();
  @Output() selectCotizacion = new EventEmitter<object>();
  @Output() actualizarDetalles = new EventEmitter<void>();
  @Output() actualizarStatus = new EventEmitter<void>();

  public formOrdenCompra: FormGroup;

  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;

  public selectedFiles: { [key: number]: File } = {};
  public proveedorSelec: any;
  public empresas: any = [];
  public isLoading: boolean = true;
  public isLoad: boolean = true;
  public showPanelCotizaciones: boolean = false;
  public enEsts = EstadoSolicitud;
  // public sending: boolean = false;

  public proveedorSeleccionado: any;

  constructor(
    private proveedoresService: ProveedoresService,
    private cotizacionesService: CotizacionesService,
    private usuariosService: UsuariosService,
    private ordenesComprasService: OrdenesCompraService,
    public formBuilder: FormBuilder,
    private alertasService: SwalComprsServiceService,
    private permisosService: PermisosService
  ) {}

  ngAfterViewInit(): void {
    this.getEmpresas();
    this.buildForm();
  }

  guardarPrecios() {
    this.savePrices.emit();
  }

  manejoCheck1(prov: any) {
    // console.log(prov);
    this.proveedorSeleccionado = prov;
    this.selectCotizacion.emit(prov);
  }

  /**
   * construye el formulario
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formOrdenCompra = this.formBuilder.group({
        entrega: new FormControl("", Validators.required),
        observaciones: new FormControl(null),
      });
      resolve(true);
    });
  }

  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }

  /**
   *  Envía los valores del formulario al servicio
   */
  public setValuesForm() {
    this.cotizacionesService.setForm(this.formOrdenCompra);
  }

  /**
   * Maneja los archivos almacenados en los inputs
   * @param event cambio de archivo en el input
   * @param proveedorId id del proveedor/input
   */
  onFileChange(event: Event, proveedorId: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.cotizacionesService.setSelectedFile(proveedorId, input.files[0]);
    }
  }

  /**
   * abre los archivos en una pestaña nueva
   * @param prov ruta del archivo
   */
  verArchivos(prov: any) {
    this.proveedoresService.abrirArchivo(prov);
  }

  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    if (this.solicitudCompra.estatus === this.enEsts.EnCotizacion) {
      this.usuariosService.getEmpresas().subscribe(
        (response) => {
          if (response) {
            const rawData = response.data;

            if (this.tipo != null) {
              /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
              this.empresas = rawData.filter(
                (objeto) => objeto.isAgencia === false
              );
            } else {
              this.empresas = rawData;
            }
            this.isLoading = false;
          } else {
            this.alertasService.mostrarAlerta(
              "Error",
              response.message,
              "error",
              "danger"
            );
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error", error, "error", "danger");
        }
      );
    }
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  public generarOrden() {
    this.sending = true;
    if (!this.formDatosOC.isValid()) {
      this.alertasService.mostrarAlerta(
        "Error",
        "Entrega y forma de pago son obligatorios",
        "warning",
        "warning"
      );
      this.sending = false;
      return;
    }

    const datos = this.formatData();

    this.ordenesComprasService.save(datos).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Guardado",
            "Se generó correctamente la orden de compra",
            "success",
            "success"
          );
          this.actualizarDetalles.emit();
          this.actualizarStatus.emit();
          this.mostrarObs = false;
          this.sending = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "warning",
            "warning"
          );
          this.sending = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error guardando los datos:",
          error,
          "error",
          "danger"
        );
        this.sending = false;
      }
    );
  }

  public formatData() {
    const datos = {
      ...this.formDatosOC.getFormValues(),
      cotizaciones_id: this.proveedorSeleccionado?.cotizaciones_id,
      id_cotizacion_prov: this.proveedorSeleccionado?.id,
      id_solicitud_compra: this.solicitudCompra?.id,
    };
    return datos;
  }

  public manejoCheck(prov: any): void {
    const total = this.totalCotizacion(prov);
    const noAutorizado = prov.autorizado === 0;

    if (total > 50000 && noAutorizado) {
      this.solicitarAutorizacion();
      return;
    }

    if (total === 0) {
      // this.compras.setMostrarBoton(false);
      this.mostrarObs = false;
      this.alertasService.mostrarAlerta(
        "El total de la cotización debe ser mayor a 0",
        "Carga los precios y da click en el botón de guardar precios",
        "info",
        "info"
      );
      return;
    }
    this.proveedorSeleccionado = prov;
    // this.proveedorSelec = prov;
    // this.compras.setMostrarBoton(true);
    this.mostrarObs = true;
  }

  totalCotizacion(prov) {
    const detalles = prov.detalles;
    let totalCotizacion = 0;
    detalles.forEach((detalle) => {
      const total =
        Number(detalle.importe_unitario) *
        Number(detalle.detalle_solicitud.cantidad);
      totalCotizacion = totalCotizacion + total;
    });
    return totalCotizacion * 1.16;
  }

  private solicitarAutorizacion() {
    Swal.fire({
      title: "La cotización supera el limite establecido",
      text: "Es necesario que la planta autorice esto \n ¿Deseas solicitar autorizacion ahora?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No, intentar con otra cotización",
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarSolAutorizacion();
      }
    });
  }

  private enviarSolAutorizacion() {
    this.cotizacionesService
      .solicitarAutorizacion(this.solicitudCompra.id)
      .subscribe(
        (response) => {
          if (response.status === "success") {
            this.alertasService.mostrarAlerta(
              "Enviado",
              "Se ha solicitado la autorización por parte de la planta",
              "success",
              "success"
            );
            this.actualizarStatus.emit();
          } else {
            this.alertasService.mostrarAlerta(
              "Error guardando los datos:",
              response.message,
              "error",
              "danger"
            );
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta(
            "Error guardando los datos:",
            error,
            "error",
            "danger"
          );
        }
      );
  }

  public actDetalle() {
    this.actualizarDetalles.emit();
  }

  public reenviarSC(item) {
    item.loading = true;
    const data = {
      proveedores: [item?.proveedores_id[0]?.id],
      consideraciones: "",
      solicitudes_compra_id: this.solicitudCompra?.id,
      // loading : item.loading
    };

    this.cotizacionesService.reenviarCorreo(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Guardado",
            "Se reenvió correctamente el correo de solicitud de cotización",
            "success",
            "success"
          );
          item.loading = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "warning",
            "warning"
          );
          item.loading = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error guardando los datos:",
          error,
          "error",
          "danger"
        );
        item.loading = false;
      }
    );
  }
}
