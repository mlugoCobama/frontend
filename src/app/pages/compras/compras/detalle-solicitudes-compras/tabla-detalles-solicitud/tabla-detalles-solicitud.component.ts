import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

import { EstadoSolicitud } from "../../estado-solicitud.enum";

import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { DetallesSolicitudService } from 'src/app/core/services/compras/detalles-solicitud.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { CatUnidadesMedidasService } from 'src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service';
import { CotizacionesService } from 'src/app/core/services/compras/cotizaciones/cotizaciones.service';
import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-tabla-detalles-solicitud',
  templateUrl: './tabla-detalles-solicitud.component.html',
  styleUrl: './tabla-detalles-solicitud.component.css'
})
export class TablaDetallesSolicitudComponent implements OnInit {

  formulario!: FormGroup;

  public unidadMedidas = [];
  public datos = [];
  public cotProv: any[] = [];
  public cotizacion: any;

  public enEsts = EstadoSolicitud;

  public mostrarTotal = false;
  public formDisabled: boolean = false;
  public isLoad: boolean = true;
  public sending: boolean = false;
  public modoLectura:boolean = false;

  @Output() openModal = new EventEmitter<string>();

  @Input() solicitudCompra:any;
  @Input() modifica:any;

    constructor(
    public compras: ComprasService,
    private formBuilder: FormBuilder,
    private detallesService: DetallesSolicitudService,
    private alertasService: SwalComprsServiceService,
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    private cotizacionesService: CotizacionesService,
    public permisosService: PermisosService

  ) {}

  ngOnInit(): void {
    this.getDetalles();
    this.getUnidades();
    this.buildForm();
  }

  /**
   * Recupera los detalles de la solicitud
   */
  public getDetalles() {
    this.isLoad = true;
    this.compras.getOne(this.solicitudCompra?.id).subscribe(
      (response) => {
        if (response) {
          this.datos = response.data;
          this.cargarDatos();
          this.toggleModoLectura();
          this.getProveedoresCotizacion();
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

  /**
   * Recupera el catalogo de unidades
   */
  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidadMedidas = response.data;
        } else {
          this.alertasService.mostrarAlerta("Error!",response.message, "error", "danger" );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger" );
      }
    );
  }

  /**
  * Construye el formulario
  */
  public buildForm(){
    this.formulario = this.formBuilder.group({
      detalles: this.formBuilder.array([])
    });
  }

  /** Atajo para acceder al FormArray */
  get detalles(): FormArray {
    return this.formulario.get('detalles') as FormArray;
  }

  /**
   * Crea un FormGroup a partir de un objeto (o vacío si no se pasa algun valor)
  */
  private crearDetalle(dato?: any): FormGroup {
    const unidad = `${dato?.DetalleAutotanque?.DatosVehiculo?.eco} ${dato?.DetalleAutotanque?.DatosVehiculo?.marca } ${dato?.DetalleAutotanque?.DatosVehiculo?.submarca } (${dato?.DetalleAutotanque?.DatosVehiculo?.modelo }) - ${dato?.DetalleAutotanque?.DatosVehiculo?.no_serie}`
    return this.formBuilder.group({
      id: [dato?.id ?? null],
      cantidad: [dato?.cantidad  ?? 1,Validators.required],
      descripcion:[dato?.descripcion ?? '',Validators.required],
      observaciones: [dato?.observaciones ?? ''],
      unidadMedida: [dato?.unidadMedida?.id ?? null, Validators.required],
      img_referencia: [dato?.img_referencia ?? null],
      solicitudes_compra_id: [dato?.solicitudes_compra_id ?? null],
      autotanque: [ unidad  ?? ''],
      no_serie: [dato?.DetalleAutotanque?.DatosVehiculo?.no_serie ?? null],
      confirmado: [dato?.confirmado ?? 0],
      recuperable: [dato?.recuperable ?? 0]
    });
  }


  /**
   * Genera los campos a partir de los valores del form
   */
  private cargarDatos(): void {
    this.datos.forEach(dato => this.detalles.push(this.crearDetalle(dato)));
  }


  agregarDetalle(): void {
    this.detalles.push(this.crearDetalle());
  }

  eliminarDetalle(index: number): void {
    this.detalles.removeAt(index);
  }

  /**
   * Formatea de los datos del form array y genera un array de datos
   * Normalizamos confirmado a 1/0 antes de enviar al backend
   * @returns array datos formateados para la bd
   */
  getValuesform(): void {
    const datos = this.formulario.value.detalles.map((dato: any) => ({
      ...dato,
      confirmado: dato.confirmado ? 1 : 0
    }));
    return datos;
  }

  getDetalleControl(i: number, controlName: string) {
    return (this.detalles.at(i) as FormGroup).get(controlName)!;
  }

  public modificarDetalles() {
    this.sending =  true;
    if (this.validarTamaño(this.getValuesform())) {
      Swal.fire({
          title: "¿Estas seguro?",
          text: "Los detalles se actualizaran",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.detallesService
              .edit(this.solicitudCompra.id, this.getValuesform())
              .subscribe(
                (response) => {
                  if (response.status === "success") {
                    this.alertasService.mostrarAlerta(
                      "Actualizado",
                      "Se han actualizado los detalles de la solicitud",
                      "success",
                      "success"
                    );
                    this.detalles.clear();
                    this.getDetalles();
                  } else {
                    this.alertasService.mostrarAlerta(
                      "Error",
                      response.message,
                      "warning",
                      "warning"
                    );
                  }
                },
                (error) => {
                  console.error("Error enviando datos:", error);
                }
              );
          } else {
            this.sending =  false;
            return
          }
        });
      } else {
        this.alertasService.mostrarAlerta(
          "Error",
          "Ningun elemento esta autorizado",
          "error",
          "danger"
        );
        this.sending =  false;
        return
      }
    this.sending =  false;
    }

    validarTamaño(datos) {
    const contador = datos.reduce((acc, detalle) => acc + detalle.confirmado, 0);
    return contador !== 0;
  }


/**
 * Habita o inhabilita los campos del formulario
 */
toggleModoLectura() {
  this.modoLectura = !this.modoLectura;

  this.detalles.controls.forEach(control => {
    if (this.modoLectura) {
      control?.disable();
    } else {
      control?.enable();
    }
  });
}

/**
 * Despliega el modal de la imagen
 */
  verReferencia(image: string) {
    this.openModal.emit(image);
  }

  /**
   * Recupera proveedores-cotizacion
   */
  public getProveedoresCotizacion() {
    this.cotizacionesService.getOne(this.solicitudCompra?.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.cotizacion = response.dataCotizacion;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
      }
    );
  }

  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto)
      .then(() => {
        // console.log(`Texto copiado: ${texto}`);
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles', err);
      });
  }

  sumarDetalle(dataSource) {
  return dataSource.reduce((acumulador, objeto) => {
    return acumulador + (((objeto['importe_unitario'] ?? 0) * (objeto['detalle_solicitud']['cantidad'] ?? 0)) || 0);
    }, 0);
  }


  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }


}
