import { Component , OnInit, AfterViewInit, ViewChild, EventEmitter} from '@angular/core';
import { CotizacionesService } from 'src/app/core/services/compras/cotizaciones/cotizaciones.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FormDatosEntregaOcComponent } from '../../form-datos-entrega-oc/form-datos-entrega-oc.component';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
@Component({
  selector: "app-modal-cambio-proveedor",
  templateUrl: "./modal-cambio-proveedor.component.html",
  styleUrl: "./modal-cambio-proveedor.component.css",
})
export class ModalCambioProveedorComponent implements OnInit {
  @ViewChild("formDatosEntregaOc", { static: false })
  formDatosEntregaOc!: FormDatosEntregaOcComponent;
  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();
  public mostrarObs = true;
  public solicitudCompra: any;
  public formSelctProv: FormGroup;

  public cotProv: any = [];
  public cotizacion: any;
  public isLoad: boolean = true;
  public deshabilitado: boolean = false;

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    private cotizacionesService: CotizacionesService,
    private alertasService: SwalComprsServiceService,
    private ordenesCompras: OrdenesCompraService
  ) {}

  ngOnInit(): void {
    this.getProveedoresCotizacion();
    this.buildForm();
  }

  buildForm() {
    this.formSelctProv = this.fb.group({
      proveedorSeleccionado: ["", Validators.required],
    });
  }

  public getProveedoresCotizacion() {
    this.isLoad = true;
    this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.cotizacion = response.dataCotizacion;
          this.isLoad = false;
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

  get selctProvFormControl() {
    return this.formSelctProv.controls;
  }

  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => {
      this.modalCerrado.emit();
    }, 150);
  }

  public buildValues() {
    const idCotProv = this.formSelctProv.value;
    const data = {
      ...this.formDatosEntregaOc.getFormValues(),
      idSolicitudCompra: this.solicitudCompra?.id,
      idCotProv: idCotProv.proveedorSeleccionado,
    };
    return data;
  }

  public saveChanges() {
    this.deshabilitado = true;
    if (!this.formSelctProv.valid || !this.formDatosEntregaOc.isValid()) {
      this.alertasService.mostrarAlerta(
        "Error",
        "Falta información importante, revisa los campos en rojo",
        "warning",
        "warning"
      );
      this.formSelctProv.markAllAsTouched();
      this.deshabilitado = false;
      return;
    }
    const data = this.buildValues();
    this.ordenesCompras.cambiarProveedorSeleccionado(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Listo",
            response.message,
            "success",
            "success"
          );
          this.event.emit(true);
          this.deshabilitado = false;
          this.cerrarModal();
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger"
          );
          this.deshabilitado = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
        this.deshabilitado = false;
      }
    );
  }
}
