import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import Swal from "sweetalert2";

@Component({
  selector: "app-form-files-facturas",
  templateUrl: "./form-files-facturas.component.html",
  styleUrl: "./form-files-facturas.component.css",
})
export class FormFilesFacturasComponent implements OnInit {
  @Input() solicitudCompra: any;
  
  @Output() actualizarStatus = new EventEmitter<void>();
  @Output() setDataOrdenCompra = new EventEmitter<void>();

  public ordenCompra: any;
  public formDocsOrdenCompra: FormGroup;
  public formData = new FormData();
  public habilitado: boolean = true;
  public submitted: boolean = false;
  public isLoad: boolean = true;
  public mostrarDtsFac: boolean = false;

  public hasFiles: boolean = false;
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

  public hasFacturas: boolean = false;
  public hasComprobantePago: boolean = false;
  public idDocOrdC: any;

  constructor(
    public formBuilder: FormBuilder,
    private ordenesComprasService: OrdenesCompraService,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOrdenCompra();
  }

  setOrdenCompra(data: any) {
    this.setDataOrdenCompra.emit(data);
  }

  //Construye el formulario para las facturas
  private buildForm() {
    this.formDocsOrdenCompra = this.formBuilder.group({
      factura_xml: new FormControl(null, Validators.required),
      factura_pdf: new FormControl(null, Validators.required),
      comprobante_pago: new FormControl(null),
    });
  }

  get ordenDocsCompraFormControl() {
    return this.formDocsOrdenCompra.controls;
  }

  // Recupera la orden de compra actual en base a la solicitud de compra 
  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response;
          this.setOrdenCompra(this.ordenCompra);
          
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

  /**
   * Guarda los archivos de las facturas 
   * ------------------------------PDF
   * ------------------------------XML
   * @returns 
   */
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

    this.formData.append("orden_compra_id", idOrdenCompra);

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

  /**
   * Guarda los archivos de comprobante de pago
   * ---------------------------------------PDF
   * @returns 
   */
  public guardarComPago() {
    if (this.formData.has("comprobante_pago")) {

      const idOrdenCompra = this.ordenCompra.id;
      const idDocOC = this.idDocOrdC;

      this.formData.append("_method", "PUT");
      this.formData.append("orden_compra_id", idOrdenCompra);

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
    } else {
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

  /**
   * Actualiza el estatus de la compra a pagado
   */
  public marcarComoPagada() {
    this.ordenesComprasService
      .edit(this.ordenCompra.id, this.solicitudCompra.id)
      .subscribe(
        (response) => {
          if (response.status === "success") {
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
            this.actualizarStatus.emit();
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
  }

  /**
   * Lee el XML 
   * ----------Lee los xmls de la orden de compra
   * ----------Calcula la suma de los xml recuperados
   * ----------Verifica cual es el método de pago
   */
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

 /**
  * Lee los xmls de la orden de compra
  * @param xmls data que recibe del servicio
  */
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

  //Calcula la suma de los xml recuperados
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

  /**
   * Verifica cual es el método de pago
   * -------------------------------PPD
   * -------------------------------PUE
   */
  checkMetodoPago() {
    this.metodoPago = this.factura.metodoPago?.metodoPago;
    if (this.metodoPago === "PPD") {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
  }

  // Llama el service para abrir el archivo
  verArchivos(prov: any) {
    
    this.proveedoresService.abrirArchivo(prov);

  }

  //Descarga  todas las facturas de la orden de compra en formato zip
  public descargarFacturas() {
    this.ordenesComprasService.descargarFacturas(this.ordenCompra.id).subscribe((response) => {

        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Facturas_${this.ordenCompra.folio_oc}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }

  onFileChange1(event: any, fieldName: string) {
    // Obtiene el archivo del input
    this.formData.delete(fieldName);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }
}
