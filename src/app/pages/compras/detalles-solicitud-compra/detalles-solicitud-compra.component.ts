import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

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

  mostrarCotizacionFlag: boolean = false;

  public mostrarTotal: boolean = false;

  public submitted: boolean = false;
  public isLoad: boolean = true;
  public isDisabled: boolean = false;
  public mostrarObs: boolean = false;

  public formSolicitudCotizacion: FormGroup;
  public formSeleccionarProveedor: FormGroup;
  public formOrdenCompra: FormGroup;

  public proveedores: any;
  public ordenCompra: any;
  public selectedImage: any;
  public correosProv: any;
  public data: any;
  public proveedorSelec: any;
  public cotizacion: any;
  public totalMasBajo: any;

  public totals: any = {};
  public cotProv: any[] = [];
  public detalles: any[] = [];
  public formData = new FormData();
  public proveedoresSeleccionados: any[] = [];
  public selectedFiles: { [key: number]: File } = {};

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
    this.comprasService.generateOrder$.subscribe(() => {
      this.generarOrden();
    });

    this.buildForm();
    this.getDetalle();

    if (this.solicitudCompra.estatus === 1) {
      this.getProveedores();
    }
    if (this.solicitudCompra.estatus === 3) {
      this.getOrdenCompra()
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
  }

  get solicitudCotizacionFormControl() {
    return this.formSolicitudCotizacion.controls;
  }

  get seleccionarProveedorFormControl() {
    return this.formSeleccionarProveedor.controls;
  }

  
  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }

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
        ...proveedores,
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
          } else {
            console.log(response.message);
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

  onSelectChange(selectedId: string, index: number) {
    // obtiene el objeto por medio del id y lo agrega al array
    const selectedItem = this.proveedores.find(
      (item) => item.id === +selectedId
    );
    if (selectedItem) {
      this.proveedoresSeleccionados[index] = selectedItem;
    }
    console.log(selectedItem);
  }

  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response;
          console.log(this.ordenCompra);
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

  private async generarFolioCo(): Promise<string> {
    //Genera el folio de las cotizaciones
    // Metodo para generar el folio
    const response = await this.cotizacionesService.obtenerFolio().toPromise();
    return response.nuevoFolio;
  }

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

            switch (this.solicitudCompra.estatus) {
              case 1:
                this.solicitudCompra.estado = "SOLICITADO";
                this.solicitudCompra.claseEstado = "bg-primary";
                break;

              case 2:
                this.solicitudCompra.estado = "EN COTIZACIÓN";
                this.solicitudCompra.claseEstado = "bg-info";
                break;

              case 3:
                this.solicitudCompra.estado = "ORDEN DE COMPRA";
                this.solicitudCompra.claseEstado = "bg-warning";
                break;

              case 4:
                this.solicitudCompra.estado = "AUTORIZADA";
                this.solicitudCompra.claseEstado = "bg-success";
                break;

              case 5:
                this.solicitudCompra.estado = "CANCELADA";
                this.solicitudCompra.claseEstado = "bg-danger";
                break;

              case 6:
                this.solicitudCompra.estado = "EN SURTIDO";
                this.solicitudCompra.claseEstado = "badge-soft-warning";
                break;
  
              case 7:
                this.solicitudCompra.estado = "RECIBIDO";
                this.solicitudCompra.claseEstado = "badge-soft-info";
                break;
  
              default:
                this.solicitudCompra.estado = "DESCONOCIDO";
                this.solicitudCompra.claseEstado = "badge-soft-dark";
                break;
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

  validateNumberInput(event: any) {
    const inputValue = event.target.value;
    const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
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
    //Recupera los archivos de los input file
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
    this.comprasService.setMostrarBoton(true);
    this.mostrarObs = true;
  }

  private async generarFolioOc(): Promise<string> {
    const response = await this.ordenesComprasService
      .obtenerFolio()
      .toPromise();
    return response.nuevoFolio;
  }

  public cancelarOrden(){
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

  public autorizarOrden(){
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
            this.ordenesComprasService.enviarSolicitudSurtido(this.solicitudCompra.id).subscribe(
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
            this.ordenesComprasService.edit(this.solicitudCompra.id, this.ordenCompra.id).subscribe(
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
}
