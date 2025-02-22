import { Component, Input, OnInit, TemplateRef, signal} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
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

  @Input() solicitudCompra: any;

  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;
  factura: any = {
    comprobantes: [],
    impuestos: [],
    emisor: {},
    receptor: {},
    sumaSubTotal: 0,
    sumaTotal: 0,
    metodoPago: {},
  };
  metodoPago: string;

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
  public formSolicitudCotizacion: FormGroup;
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

    this.generarOrdenSubscripcion =
      this.comprasService.generateOrder$.subscribe(() => {
        this.generarOrden();
      });

    this.buildForm();
    this.getDetalle();

    // Valida el estatus de la solcitud para recuperar datos
    if (this.solicitudCompra.estatus === 1) {
      this.getProveedores();
    }
    // Valida el estatus de la solcitud para mostrar datos
    if (
      this.solicitudCompra.estatus === 3 ||
      this.solicitudCompra.estatus === 4 ||
      this.solicitudCompra.estatus > 5
    ) {
      this.getOrdenCompra();
    }
  }

  ngOnDestroy(): void {
    if (this.generarOrdenSubscripcion) {
      this.generarOrdenSubscripcion.unsubscribe();
    }
  }

  private buildForm() {
    this.formSolicitudCotizacion = this.formBuilder.group({
      empresa1: new FormControl(null, Validators.required),
      empresa2: new FormControl(null, Validators.required),
      empresa3: new FormControl(null, Validators.required),
      consideraciones: new FormControl(null),
    });
    this.formSeleccionarProveedor = this.formBuilder.group({
      proveedorSelecionado: new FormControl(null, Validators.required),
    });
    this.formOrdenCompra = this.formBuilder.group({
      observaciones: new FormControl(null, Validators.required),
    });

    this.formDocsOrdenCompra = this.formBuilder.group({
      factura_xml: new FormControl(null, Validators.required),
      factura_pdf: new FormControl(null, Validators.required),
      comprobante_pago: new FormControl(null),
    });
  }

  get solicitudCotizacionFormControl() {
    return this.formSolicitudCotizacion.controls;
  }

  get seleccionarProveedorFormControl() {
    return this.formSeleccionarProveedor.controls;
  }

  get ordenDocsCompraFormControl() {
    return this.formDocsOrdenCompra.controls;
  }

  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }
  //Envía la solicitud de cotización a los proveedores
  public async enviarSolicitudCotizacion() {
    this.submitted = true;
    this.isDisabled = true;
    if (this.formSolicitudCotizacion.invalid) {
      this.isLoad = false;
      Swal.fire({
        title: "Algo anda mal",
        text: "Debes llenar correctamente todos los campos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      this.isDisabled = false;
      return;
    }

    this.correosProv = this.formSolicitudCotizacion.value;
    if (
      this.correosProv.empresa1 === this.correosProv.empresa2 ||
      this.correosProv.empresa2 === this.correosProv.empresa3 ||
      this.correosProv.empresa1 === this.correosProv.empresa3
    ) {
      Swal.fire({
        title: "Algo anda mal",
        text: "Debes de seleccionar proveedores distintos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      this.isDisabled = false;
      return;
    }

    try {
      const detalles = await this.getDetalle();
      const idSolicitud = this.solicitudCompra.id;
      const folioCo = await this.generarFolioCo();
      const proveedores = this.proveedoresSeleccionados;
      const consideraciones = this.correosProv.consideraciones;
      this.data = {
        proveedores:proveedores,
        detalles,
        fecha: this.fecha(),
        solicitudes_compra_id: idSolicitud,
        folioCo,
        consideraciones,
      };

      this.comprasService.sendMail(this.data).subscribe(
        (response) => {
          if (response.status === "success") {
            Swal.fire({
              title: "Enviado",
              text: "Tu solicitud de cotización se ha enviado correctamente",
              buttonsStyling: false,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            this.mostrarCotizacionFlag = false;
            this.isLoad = false;
            this.isDisabled = false;
            this.solicitudCompra.estatus = 2;
            this.getDetalle();
          } else {
            Swal.fire({
              title: response.message,
              text: 'Revisa que el proveedor tenga un correo asignado',
              buttonsStyling: false,
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            console.log(response.errors);
            this.isDisabled = false;
          }
        },
        (error) => {
          console.error("Error enviando datos:", error);
        }
      );
    } catch (error) {
      console.error("Error obteniendo detalles:", error);
    }

    this.submitted = false;
    this.formSolicitudCotizacion.reset();
  }
  // Recupera los contenidos de los selects
  onSelectChange(selectedId: string, index: number) {
    // obtiene el objeto por medio del id y lo agrega al array
    const selectedItem = this.proveedores.find(
      (item) => item.id === +selectedId
    );
    if (selectedItem) {
      this.proveedoresSeleccionados[index] = selectedItem;
    }
  }

  public hasFacturas: boolean = false;
  public hasComprobantePago: boolean = false;
  public idDocOrdC: any;
  // recupera los datos de la orden de compra
  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response;
          this.isLoad = false;

          if (this.ordenCompra.documentos.length > 0) {
            this.hasFiles = true;

            this.leerXML();

            this.hasFacturas = true;
            const ultimoIndex = this.ordenCompra.documentos.length;
            const comprobantePago =
              this.ordenCompra.documentos[ultimoIndex - 1].comprobante_pago;
            const ultimoId = this.ordenCompra.documentos[ultimoIndex - 1].id;
            if (comprobantePago) {
              this.hasComprobantePago = true;
            } else {
              this.hasComprobantePago = false;
              this.idDocOrdC = ultimoId;
            }
          }
          if (this.ordenCompra.documentos.length === 0) {
            this.habilitado = true;
            this.hasFacturas = false;
            this.hasComprobantePago = true;
          }
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public leerXML() {
    this.ordenesComprasService.getContenidoXML(this.ordenCompra.id).subscribe({
      next: (data) => {
        this.parseVariosXml(data.contenidos);
        this.calcularSumas();
        this.checkMetodoPago();
      },
      error: (err) => console.error("error al obtener los xml: ", err),
    });
    this.mostrarDtsFac = true;
  }

  checkMetodoPago() {
    this.metodoPago = this.factura.metodoPago?.metodoPago;
    if (this.metodoPago === "PPD") {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
  }

  //Recupera todos los registros de los proveedores
  private getProveedores() {
    this.proveedoresService.getAll().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;

          const opcionPredeterminada = {
            id: null,
            nombre: "Seleccione uno",
            contacto: null,
            telefono: null,
            localidad: null,
            condiciones: null,
            servicios: null,
            correo: null,
            horario_atencion: null,
            tiempo_entrega: null,
            dias_credito: 0,
            activo: 1,
          };

          this.proveedores.unshift(opcionPredeterminada);

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
  //Genera el folio de las cotizaciones
  private async generarFolioCo(): Promise<string> {
    const response = await this.cotizacionesService.obtenerFolio().toPromise();
    return response.nuevoFolio;
  }
  // Método para asignar una fecha
  public fecha() {
    // Método para asignar una fecha
    // obtener la fecha en el formato correcto para la bd
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
    const dia = ("0" + fecha.getDate()).slice(-2);
    const horas = ("0" + fecha.getHours()).slice(-2);
    const minutos = ("0" + fecha.getMinutes()).slice(-2);
    const segundos = ("0" + fecha.getSeconds()).slice(-2);
    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  public mostrarDivCotizaciones() {
    //Envía un true al service para mostrar el div
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

  private getDetalle(): Promise<any> {
    //Recupera el detalle y agrega columnas a la tabla
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

  onFileChange(event: Event, proveedorId: number) {
    //Recupera los archivos de los input file de la tabla proveedores
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[proveedorId] = input.files[0];
    }
  }

  public guardarPrecios() {
    const formData = new FormData();
    let allFilesUploaded = true;
    let datosIngresados = false;
    let archivosIngresados = false;
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

      if (this.selectedFiles[proveedor.id]) {
        formData.append(
          `files[${proveedor.id}]`,
          this.selectedFiles[proveedor.id]
        );
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
          this.isLoad = false;
          this.selectedFiles = {};
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error guardando los datos:", error);
      }
    );
  }

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

  verArchivos(prov: any) {
    //llama el service para abrir el archivo
    this.proveedoresService.abrirArchivo(prov);
  }

  public generarOrden() {
    this.comprasService.setMostrarBoton(false);

    this.generarFolioOc().then((folio_oc) => {
      const fecha = this.fecha();

      const observacion = this.formOrdenCompra.value;
      const observaciones = observacion.observaciones;

      const cotizaciones_id = this.proveedorSelec.cotizaciones_id;
      const cotizacionProveedor = this.proveedorSelec.id;

      const solicitudCompra = this.solicitudCompra.id;

      const datos = {
        folio_oc: folio_oc,
        fecha: fecha,
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
              text: "Hubo un error",
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
    });
  }

  public manejoCheck(prov: any) {
    //recupera la cotización seleccionada y muestra el botón de generar orden de compra
    const proveedorSleccionado = prov;
    // console.log(proveedorSleccionado.cotizaciones_id);
    this.proveedorSelec = proveedorSleccionado;
    console.log(this.proveedorSelec);
    this.comprasService.setMostrarBoton(true);
    this.mostrarObs = true;
  }

  private async generarFolioOc(): Promise<string> {
    const response = await this.ordenesComprasService
      .obtenerFolio()
      .toPromise();
    return response.nuevoFolio;
  }

  public cancelarOrden() {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "La orden será cancelada",
      icon: "error",
      confirmButtonText: " SI ",
      showCancelButton: true,
      cancelButtonText: " NO ",
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.ordenesComprasService.destroy(this.solicitudCompra.id).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.message);
              Swal.fire({
                title: "Cancelada!",
                text: "La orden ha sido cancelada.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 5;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }
      this.isLoad = false;
    });
  }

  public autorizarOrden() {
    const data = {
      idSolicituCompra: this.solicitudCompra.id,
      idOrdenCompra: this.ordenCompra.id,
    };
    Swal.fire({
      title: "Ya casi!!",
      text: "Deseas enviar la solicitud de surtido al proveedor?",
      icon: "info",
      showDenyButton: true,
      confirmButtonText: " SI ",
      denyButtonText: `NO`,
      customClass: {
        confirmButton: "btn btn-success px-4",
        denyButton: "btn btn-danger ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenesComprasService.enviarSolicitudSurtido(data).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.data);
              Swal.fire({
                title: "Enviada!!",
                text: "La orden de compra ha sido autorizada y enviada al proveedor.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 6;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      } else if (result.isDenied) {
        this.ordenesComprasService.autorizarOrdenCompra(data).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.data);
              Swal.fire({
                title: "Orden autorizada!!",
                text: "La orden sera marcada como autorizada",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.solicitudCompra.estatus = 4;
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }
      this.isLoad = false;
    });
  }

  public contarCaracteres() {
    // Valida la longitud de los text area
    this.caracteresRestantes = this.longitudMaxima - this.text.length;
  }

  onFileChange1(event: any, fieldName: string) {
    // Obtiene el archivo del input
    this.formData.delete(fieldName);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
      console.log(this.formData);
    }
  }

  public guardarArchivos() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formDocsOrdenCompra.invalid) {
      Swal.fire({
        title: "Alerta",
        text: "Debes adjuntar la factura en ambos formatos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      this.isLoad = false;
      return;
    }

    const idOrdenCompra = this.ordenCompra.id;
    // this.formData.append("_method", "PUT");
    this.formData.append("orden_compra_id", idOrdenCompra);
    this.formData.append("fecha", this.fecha());
    this.ordenesComprasService.saveDocs(this.formData).subscribe(
      (response) => {
        if (response.status === "success") {
          this.getOrdenCompra();
          Swal.fire({
            title: "Guardado",
            text: "Documentos guardados correctamente",
            buttonsStyling: false,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success px-4",
              cancelButton: "btn btn- ms-2 px-4",
            },
          });

          this.isLoad = false;
          this.formData = new FormData();
          this.submitted = false;
          this.formDocsOrdenCompra.reset();
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public guardarComPago() {

    if(this.formData.has('comprobante_pago')){
      const idOrdenCompra = this.ordenCompra.id;
      const idDocOC = this.idDocOrdC;
      this.formData.append("_method", "PUT");
      this.formData.append("orden_compra_id", idOrdenCompra);
      this.formData.append("fecha", this.fecha());
  
      this.ordenesComprasService.saveDocs1(idDocOC, this.formData).subscribe(
        (response) => {
          if (response.status === "success") {
            this.getOrdenCompra();
            Swal.fire({
              title: "Guardado",
              text: "Documentos guardados correctamente",
              buttonsStyling: false,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
  
            this.isLoad = false;
            this.formData = new FormData();
            this.formDocsOrdenCompra.reset();
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }else{
      Swal.fire({
        title: "Alerta",
        text: "Debes adjuntar el comprobante pago",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      this.isLoad = false;
      return;
    }

  }

  parseVariosXml(xmls: string[]) {
    const parser = new DOMParser();
    const ns = "http://www.sat.gob.mx/cfd/4";

    this.factura = {
      comprobantes: [],
      impuestos: [],
      emisor: {},
      receptor: {},
      metodoPago: {},
    };

    xmls.forEach((xml, index) => {
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      const comprobante = xmlDoc.getElementsByTagNameNS(ns, "Comprobante")[0];
      if (comprobante) {
        this.factura.comprobantes.push({
          fecha: comprobante?.getAttribute("Fecha"),
          folio: comprobante?.getAttribute("Folio"),
          serie: comprobante?.getAttribute("Serie"),
          subTotal: parseFloat(comprobante?.getAttribute("SubTotal") || "0"),
          moneda: comprobante?.getAttribute("Moneda"),
          total: parseFloat(comprobante?.getAttribute("Total") || "0"),
        });
      }

      const impuestos = xmlDoc.getElementsByTagNameNS(ns, "Impuestos")[0];
      if (impuestos) {
        this.factura.impuestos.push({
          totalImpuestosTrasladados:
            impuestos?.getAttribute("TotalImpuestosTrasladados") || "0.00",
        });
      }

      if (index === 0) {
        const emisor = xmlDoc.getElementsByTagNameNS(ns, "Emisor")[0];
        if (emisor) {
          this.factura.emisor = {
            rfc: emisor?.getAttribute("Rfc"),
            nombre: emisor?.getAttribute("Nombre"),
            regimenFiscal: emisor?.getAttribute("RegimenFiscal"),
          };
        }

        const metodoPago = xmlDoc.getElementsByTagNameNS(ns, "Comprobante")[0];
        if (metodoPago) {
          this.factura.metodoPago = {
            metodoPago: metodoPago?.getAttribute("MetodoPago"),
          };
        }
        const receptor = xmlDoc.getElementsByTagNameNS(ns, "Receptor")[0];
        if (receptor) {
          this.factura.receptor = {
            rfc: receptor?.getAttribute("Rfc"),
            nombre: receptor?.getAttribute("Nombre"),
            usoCFDI: receptor?.getAttribute("UsoCFDI"),
            domicilioFiscalReceptor: receptor?.getAttribute(
              "DomicilioFiscalReceptor"
            ),
          };
        }
      }
    });
  }

  calcularSumas() {
    this.factura.sumaSubTotal = this.factura.comprobantes.reduce(
      (sum, comprobante) => sum + comprobante.subTotal,
      0
    );
    this.factura.sumaTotal = this.factura.comprobantes.reduce(
      (sum, comprobante) => sum + comprobante.total,
      0
    );
  }

  public descargarFacturas() {
    this.ordenesComprasService
      .descargarFacturas(this.ordenCompra.id)
      .subscribe((response) => {
        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Facturas_${this.ordenCompra.folio_oc}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  public marcarComoPagada() {
    this.ordenesComprasService
      .edit(this.ordenCompra.id, this.solicitudCompra.id)
      .subscribe(
        (response) => {
          if (response.status === "success") {
            this.getDetalle();
            console.log(response.message);
            Swal.fire({
              title: "Listo",
              text: "Se ha marcado como pagada",
              buttonsStyling: false,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });

            this.isLoad = false;
            this.solicitudCompra.estatus = 8;
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  validateNumberInput(event: any) {
    const inputValue = event.target.value;
    const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
  }
}
