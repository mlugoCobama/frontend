import {Component, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { TblFlsCotizacionComponent } from "./tbl-fls-cotizacion/tbl-fls-cotizacion.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import Swal from "sweetalert2";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Subscription } from "rxjs";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";

@Component({
  selector: "app-detalles-solicitud-compra",
  templateUrl: "./detalles-solicitud-compra.component.html",
  styleUrls: ["./detalles-solicitud-compra.component.css"],
})
export class DetallesSolicitudCompraComponent implements OnInit {
  public modalRef?: BsModalRef;
  @ViewChild(TblFlsCotizacionComponent) child: any;

  @Input() solicitudCompra: any;

  // banderas
  public hasFiles: boolean = false;
  mostrarCotizacionFlag: boolean = false;
  public mostrarTotal: boolean = false;
  public submitted: boolean = false;
  public isLoad: boolean = true;
  public isDisabled: boolean = false;
  public mostrarObs: boolean = false;
  public mostrarDtsFac: boolean = false;
  public habilitado: boolean = true;

  //Formularios
  public formSeleccionarProveedor: FormGroup;
  public formOrdenCompra: FormGroup;
  public formDocsOrdenCompra: FormGroup;

  //Objetos
  public proveedores: any;
  public ordenCompra: any;
  public selectedImage: any;
  public correosProv: any;
  public data: any;
  public proveedorSelec: any;
  public cotizacion: any;
  public totalMasBajo: any;

  //Arrays de objetos
  public totals: any = {};
  public cotProv: any[] = [];
  public detalles: any[] = [];
  public formData = new FormData();
  public proveedoresSeleccionados: any[] = [];
  public selectedFiles: { [key: number]: File } = {};

  private generarOrdenSubscripcion: Subscription;

  constructor(
    private modalService: BsModalService,
    public comprasService: ComprasService,
    private proveedoresService: ProveedoresService,
    private cotizacionesService: CotizacionesService,
    private ordenesComprasService: OrdenesCompraService,
    public formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.comprasService.mostrarCotizacion$.subscribe((mostrar) => {
      this.mostrarCotizacionFlag = mostrar;
    });

    this.generarOrdenSubscripcion = this.comprasService.generateOrder$.subscribe(() => {
        this.generarOrden();
      });

    this.getDetalle();
  }

  ngOnDestroy(): void {
    if (this.generarOrdenSubscripcion) {
      this.generarOrdenSubscripcion.unsubscribe();
    }
  }

  get seleccionarProveedorFormControl() {
    return this.formSeleccionarProveedor.controls;
  }

  //Envía un true al service para mostrar el div
  public mostrarDivCotizaciones() {
    this.comprasService.mostrarCotizacion$.subscribe((mostrar) => {
      this.mostrarCotizacionFlag = mostrar;
    });
  }

  /**
   * Open modal
   * @param content modal content
   */
  public openModal(content: any, imgReferencia: string) {
    //Abre el modal de im ref
    this.selectedImage = imgReferencia;
    this.modalRef = this.modalService.show(content, { class: "modal-sm" });
  }

  //Recupera el detalle y agrega columnas a la tabla
  private getDetalle(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this.comprasService.getOne(this.solicitudCompra.id).subscribe(
        (response) => {
          if (response) {
            this.detalles = response.data;
            if (this.solicitudCompra.estatus >= 2) {
              this.getProveedoresCotizacion();
              this.addProveedorColumns();
              this.mostrarTotal = true;
            }
            resolve(this.detalles);
            this.isLoad = false;
          } else {
            console.log(response.message);
            reject(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
          reject(error);
        }
      );
    });
  }

  // Recupera los datos cotizacion proveedores
  public getProveedoresCotizacion() {
    this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.cotizacion = response.dataCotizacion;
          this.addProveedorColumns();
          this.isLoad = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  // Calcula los totales de cada cotizacion
  public updateTotals() {
    this.totals = {};
    this.cotProv.forEach((cotizacion) => {
      let total = 0;
      const proveedorId = cotizacion.proveedores_id[0].id;
      this.detalles.forEach((detalle) => {
        const precio = parseFloat(detalle["precio_" + proveedorId]);
        if (!isNaN(precio)) {
          total += precio * detalle.cantidad;
        }
      });

      this.totals["precio_" + proveedorId] = total;
    });
    this.totalMasBajo = this.getTotalMasBajo();
  }

  // Agrega las columna en base al numero de proveedores
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

  // Guarda los precios capturados dentro de la tabla
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
    if (!datosIngresados || !archivosIngresados) {
      Swal.fire({
        title: "Error",
        text: "Recuerda que ademas de los precios también debes de adjuntar el archivo de la cotización ",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-danger px-4",
          cancelButton: "btn btn-secondary ms-2 px-4",
        },
      });
      return;
    }

    this.cotizacionesService.save(formData).subscribe(
      (response) => {
        if (response.status === "success") {
          Swal.fire({
            title: "Enviado",
            text: "Tu cotización se ha guardado correctamente",
            buttonsStyling: false,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success px-4",
              cancelButton: "btn btn-secondary ms-2 px-4",
            },
          });
          this.getDetalle();
          this.cotizacionesService.clearFiles();
          this.isLoad = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error guardando los datos:", error);
      }
    );
  }

  // Calcula el total mas bajo de la cotizacion
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
  
  //Genera el pdf de orden de compra
  public generarOrden() {
    this.formOrdenCompra = this.cotizacionesService.getForm();
    this.comprasService.setMostrarBoton(false);
    const observaciones = this.formOrdenCompra.value.observaciones;
    const cotizaciones_id = this.proveedorSelec.cotizaciones_id;
    const cotizacionProveedor = this.proveedorSelec.id;

    const solicitudCompra = this.solicitudCompra.id;

    const datos = {
      observaciones: observaciones,
      cotizaciones_id: cotizaciones_id,
      id_cotizacion_prov: cotizacionProveedor,
      id_solicitud_compra: solicitudCompra,
    };

    this.ordenesComprasService.save(datos).subscribe(
      (response) => {
        if (response.status === "success") {
          Swal.fire({
            title: "Guardado",
            text: "Se generó correctamente la orden de compra",
            buttonsStyling: false,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success px-4",
              cancelButton: "btn btn-ms-2 px-4",
            },
          });
          this.getDetalle();
          this.solicitudCompra.estatus = 3;
          this.mostrarObs = false;
        } else {
          Swal.fire({
            title: "Error",
            text: response.message,
            buttonsStyling: false,
            icon: "warning",
            customClass: {
              confirmButton: "btn btn-warning px-4",
              cancelButton: "btn btn-ms-2 px-4",
            },
          });
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error enviando datos:", error);
      }
    );

    this.submitted = false;
  }
  
  //recupera la cotización seleccionada y muestra el botón de generar orden de compra
  public manejoCheck(prov: any) {
    const proveedorSleccionado = prov;
    this.proveedorSelec = proveedorSleccionado;
    this.comprasService.setMostrarBoton(true);
    this.mostrarObs = true;
  }

  // Valida que se ingresen unicamente números al campo
  validateNumberInput(event: any) {
    const inputValue = event.target.value;
    const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
  }
}
