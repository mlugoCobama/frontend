import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from "@angular/core";

import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { DetallesSolicitudService } from "src/app/core/services/compras/detalles-solicitud.service"; 
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";
import Swal from 'sweetalert2';

import { Subscription } from "rxjs";
// import {FormGroup} from "@angular/forms";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-table-detalles-solicitud",
  templateUrl: "./table-detalles-solicitud.component.html",
  styleUrl: "./table-detalles-solicitud.component.css",
})
export class TableDetallesSolicitudComponent implements OnInit {
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

  public formDetallesSolicitud: FormGroup;

  public isLoad: boolean = true;
  public unidades:any  = [];

  public cotProv: any[] = [];
  public totals: any = {};
  public detalles: any;

  public cotizacion: any;

  public totalMasBajo: number | null = null;

  public proveedorSelec: any;
  public mostrarObs: boolean = false;

  private generarOrdenSubscripcion: Subscription;

  public enEsts = EstadoSolicitud;

  constructor(
    public compras: ComprasService,
    public cotizacionesService: CotizacionesService,
    public ordenesComprasService: OrdenesCompraService,
    public detallesService: DetallesSolicitudService,
    public alertasService: SwalComprsServiceService,
    public formBuilder: FormBuilder,
    public catUnidadesMedidasService: CatUnidadesMedidasService
  ) {
    this.formDetallesSolicitud = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getUnidades();
    this.getDetalles();
    this.generarOrdenSubscripcion = this.compras.generateOrder$.subscribe(
      () => {
        this.generarOrden();
      }
    );
  }

  private modelInputs = {
    id: "",
    cantidad:  "",
    descripcion: "",
    observaciones: "", 
    unidadMedida: "",
    img_referencia: "",
    confirmado: ""
  }

  ngOnDestroy(): void {
    if (this.generarOrdenSubscripcion) {
      //Elimino la subscripcion para evitar que se genere mas de una orden de compra la hacer click
      this.generarOrdenSubscripcion.unsubscribe();
    }
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
          }
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
   * Recupera proveedores-cotizacion
   */
  public getProveedoresCotizacion() {
    this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.cotizacion = response.dataCotizacion;

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
      const proveedorId = cotizacion.proveedores_id[0].id;

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
  validateNumberInput(event: any) {
    const inputValue = event.target.value;
    const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
  }

  /**
   * Actualiza los valores de totales
   */
  public updateTotals() {
    this.totals = {};
    this.cotProv.forEach((cotizacion) => {
      let total = 0;
      const proveedorId = cotizacion.proveedores_id[0].id;
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
  }

  /**
   *Recupera el total mas bajo
   */
  getTotalMasBajo(): number {
    let tmasBajo = Number.MAX_VALUE;
    for (let prov of this.cotProv) {
      let total = this.totals["precio_" + prov.proveedores_id[0].id];
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
    const formData = new FormData();
    let allFilesUploaded = true;
    let datosIngresados = false;
    let archivosIngresados = false;
    const selectedFiles = this.cotizacionesService.getSelectedFiles();

    this.cotProv.forEach((proveedor) => {
      this.detalles.forEach((detalle) => {
        const proveedorId = proveedor.proveedores_id[0].id;
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
    
    // if (!datosIngresados || !archivosIngresados) {
    if (!datosIngresados) {
       const mensaje =
         "Recuerda que ademas de los precios también debes de adjuntar el archivo de la cotización ";
       this.alertasService.mostrarAlerta("Error", mensaje, "warning", "warning");
       return;
     }

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
   *Recupera los valores del check
   */
  public manejoCheck(prov: any) {
    const proveedorSleccionado = prov;
    if(this.totalCotizacion(proveedorSleccionado) > 50000 && prov.autorizado === 0){
      this.solicitarAutorizacion();
      this.compras.setMostrarBoton(false);
      this.mostrarObs = false;
    }else{
      this.proveedorSelec = proveedorSleccionado;
      this.compras.setMostrarBoton(true);
      this.mostrarObs = true;
    }

    
  }

  totalCotizacion(prov){
      const detalles = prov.detalles
      let totalCotizacion = 0;
      detalles.forEach(detalle => {
        const total = Number(detalle.importe_unitario) * Number(detalle.detalle_solicitud.cantidad)
        totalCotizacion = totalCotizacion + total
      });
      return (totalCotizacion);
  }

  /**
   * Genera la orden de compra
   */
  public generarOrden() {
    this.formOrdenCompra = this.cotizacionesService.getForm();
    this.compras.setMostrarBoton(false);
    let observaciones: any;
    let entrega: any;

    if (this.formOrdenCompra === undefined || !this.formOrdenCompra.valid) {
      this.alertasService.mostrarAlerta(
        "Error",
        "Debes de seleccionar un lugar de entrega",
        "warning",
        "warning"
      );
      this.compras.setMostrarBoton(true);
      return;
    }

    if (this.formOrdenCompra != undefined && this.formOrdenCompra.valid) {
      observaciones = this.formOrdenCompra.value.observaciones;
      entrega = this.formOrdenCompra.value.entrega;
    }
    const cotizaciones_id = this.proveedorSelec?.cotizaciones_id;
    const cotizacionProveedor = this.proveedorSelec?.id;

    const solicitudCompra = this.solicitudCompra.id;

    const datos = {
      entrega: entrega || null,
      observaciones: observaciones || null,
      cotizaciones_id: cotizaciones_id,
      id_cotizacion_prov: cotizacionProveedor,
      id_solicitud_compra: solicitudCompra,
    };

    this.ordenesComprasService.save(datos).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Guardado",
            "Se generó correctamente la orden de compra",
            "success",
            "success"
          );

          this.getDetalles();
          this.actualizarStatus.emit();

          this.mostrarObs = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error",
            response.message,
            "warning",
            "warning"
          );
          // console.log(response.message);
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
        // console.error("Error enviando datos:", error);
      }
    );

    // this.submitted = false;
  }

  public modificarDetalles() {
    if (this.validarTamaño()) {
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
            .edit(this.solicitudCompra.id, this.detalles)
            .subscribe(
              (response) => {
                if (response.status === "success") {
                  this.alertasService.mostrarAlerta(
                    "Actualizado",
                    "Se han actualizado los detalles de la solicitud",
                    "success",
                    "success"
                  );
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
          this.getDetalles();
        }
      });
    } else {
      this.alertasService.mostrarAlerta(
        "Error",
        "Ningun elemento esta autorizado",
        "error",
        "danger"
      );
      this.getDetalles();
    }
  }

  validarTamaño() {
  const contador = this.detalles.reduce((acc, detalle) => acc + detalle.confirmado, 0);
  return contador !== 0;
}

cambioCheck(item, event) {
  item.confirmado = event.target.checked ? 1 : 0;
}

  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidades = response.data;
        } else {
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
      }
    );
  }

  private solicitarAutorizacion(){
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

  private enviarSolAutorizacion(){
    this.cotizacionesService.solicitarAutorizacion(this.solicitudCompra.id).subscribe(
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
          this.alertasService.mostrarAlerta("Error guardando los datos:", response.message, "error", "danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error guardando los datos:", error, "error", "danger");
        // console.error("Error guardando los datos:", error);
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
}

