import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { DetallesSolicitudService } from "src/app/core/services/compras/detalles-solicitud.service"; 
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";
import { PermisosService } from "src/app/core/services/permisos.service";

@Component({
  selector: "app-table-detalles-solicitud",
  templateUrl: "./table-detalles-solicitud.component.html",
  styleUrl: "./table-detalles-solicitud.component.css",
})
export class TableDetallesSolicitudComponent implements OnInit {

  public enEsts = EstadoSolicitud;

  @Input() mostrarTotal: boolean = false;
  @Input() solicitudCompra: any;
  @Input() ordenCompra: any;
  @Input() tipo: any;

  @Output() openModal = new EventEmitter<string>();
  @Output() showTotal = new EventEmitter<boolean>();
  @Output() savePrices = new EventEmitter<void>();
  @Output() actualizarStatus = new EventEmitter<void>();
  @Output() actualizarDetalles = new EventEmitter<void>();
  @Output() setDataCotizacion = new EventEmitter<any>();

  public formOrdenCompra: FormGroup;
  // public formDetallesSolicitud: FormGroup;

  public isLoad: boolean = true;
  public mostrarObs: boolean = false;
  public saving: boolean = false;
  
  public unidades:any  = [];
  public cotProv: any[] = [];
  public totals: any = {};
  public detalles: any;

  public cotizacion: any;
  public totalMasBajo: number | null = null;
  public proveedorSelec: any;
  
  private generarOrdenSubscripcion: Subscription;

  constructor(
    public compras: ComprasService,
    public cotizacionesService: CotizacionesService,
    public ordenesComprasService: OrdenesCompraService,
    public detallesService: DetallesSolicitudService,
    public alertasService: SwalComprsServiceService,
    public formBuilder: FormBuilder,
    public catUnidadesMedidasService: CatUnidadesMedidasService, 
    public permisosService: PermisosService
  ) {
    // this.formDetallesSolicitud = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getDetalles();
  }

  ngOnDestroy(): void {
  }

  verReferencia(image: string) {
    this.openModal.emit(image);
  }

  udtShowTotal(valor: boolean) {
    this.showTotal.emit(valor);
  }

  setCotizacion(data: any) {
    this.setDataCotizacion.emit(data);
  }

  /**
   * Recupera el detalle de la solicitud.
   * Si el estado es >= 2{
   * Recupera proveedores-cotizacion.
   * Agrega columnas e inputs.
   * Actualiza la bandera mostrar total. }
   */
  public getDetalles() {
    this.compras.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.detalles = response.data;
          if (this.solicitudCompra.estatus >= this.enEsts.EnCotizacion) {
            this.getProveedoresCotizacion();
            this.addProveedorColumns();

            this.mostrarTotal = true;
            this.udtShowTotal(true);
          }else{
            this.isLoad = false;
          }
          
        } else {
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
      }
    );
  }

  /**
   * Recupera proveedores-cotizacion
   */
  public getProveedoresCotizacion() {
    this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.cotizacion = response.dataCotizacion;
          // console.log(this.cotProv);
          this.setCotizacion(this.cotizacion);

          this.addProveedorColumns();
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

  /**
   * Agrega columnas e inputs
   */
  private addProveedorColumns() {
    this.cotProv.forEach((cotizacion) => {
      const proveedorId = cotizacion.proveedores_id.id;

      this.detalles.forEach((detalle) => {
        const detalleCotizacion = cotizacion.detalles.find(
          (d) => d.detalle_solicitud_id === detalle.id
        );

        detalle["precio_" + proveedorId] = detalleCotizacion
          ? detalleCotizacion.importe_unitario
          : "";

        detalle["disabled_" + proveedorId] = !!detalleCotizacion;
      });
      this.updateTotals();
    });
  }

  /**
   * Valida que se ingresen unicamente números al campo
   * @param event caracteres tecleados
   */
  // validateNumberInput(event: any) {
  //   const inputValue = event.target.value;
  //   const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

  //   if (!validNumber) {
  //     event.target.value = inputValue.slice(0, -1);
  //   }
  // }

  /**
   * Actualiza los valores de totales
   */
  public updateTotals() {
    this.totals = {};
    this.cotProv.forEach((cotizacion) => {
      let total = 0;
      const proveedorId = cotizacion.proveedores_id.id;
      this.detalles.forEach((detalle) => {
        // const precio = Number(detalle["precio_" + proveedorId]);
        const precio = parseFloat(detalle["precio_" + proveedorId]);
        if (!isNaN(precio)) {
          total += precio * detalle.cantidad;
        }
      });

      this.totals["precio_" + proveedorId] = total;
    });
    this.totalMasBajo = this.getTotalMasBajo();
    this.isLoad = false;
  }

  /**
   *Recupera el total mas bajo
   */
  getTotalMasBajo(): number {
    let tmasBajo = Number.MAX_VALUE;
    for (let prov of this.cotProv) {
      let total = this.totals["precio_" + prov.proveedores_id.id];
      if (total < tmasBajo) {
        tmasBajo = total;
      }
    }
    if (tmasBajo != 0) {
      return tmasBajo;
    }
  }

  /**
   * Guarda los precios capturados dentro de la tabla
   */
  public guardarPrecios() {
    this.saving = true;
    const formData = new FormData();
    let allFilesUploaded = true;
    let datosIngresados = false;
    let archivosIngresados = false;
    const selectedFiles = this.cotizacionesService.getSelectedFiles();

    this.cotProv.forEach((proveedor) => {
      this.detalles.forEach((detalle) => {
        const proveedorId = proveedor.proveedores_id.id;
        const precio = detalle["precio_" + proveedorId];

        if (!detalle["disabled_" + proveedorId] && precio) {
          formData.append(
            `precios[${detalle.id}][${proveedor.id}]`,
            precio.toString()
          );
          datosIngresados = true;
        }
      });

      if (selectedFiles[proveedor.id]) {
        formData.append(`files[${proveedor.id}]`, selectedFiles[proveedor.id]);
        archivosIngresados = true;
      }
    });
    
    this.cotizacionesService.save(formData).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Enviado",
            "Tu cotización se ha guardado correctamente",
            "success",
            "success"
          );
          this.getDetalles();
          this.cotizacionesService.clearFiles();
          this.isLoad = false;
          this.saving = false;
        } else {
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
          this.saving = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
        this.saving = false;
      }
    );
  }

  copiarTexto(texto: string): void {
    navigator.clipboard.writeText(texto)
      .then(() => {
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles', err);
      });
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  /**
   * Habilita los inputs de una columna para editar el proveedor
   * @param proveedorId id del proveedor
   */
  public habilitarEdicionProveedor(proveedorId: number) {
    this.detalles.forEach(detalle => {
      detalle["disabled_" + proveedorId] = false;
    });

    this.alertasService.mostrarAlerta("Modo edición activado", "Ya puedes modificar los precios guardados", "info", "info");
}

}

