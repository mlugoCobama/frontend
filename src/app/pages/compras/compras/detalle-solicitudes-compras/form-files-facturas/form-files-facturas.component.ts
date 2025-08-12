import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";


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
  public enEsts= EstadoSolicitud;
  public tipoFactura:any;

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

  metodoPago: string = '';

  public hasFacturas: boolean = false;
  public hasComprobantePago: boolean = false;
  public idDocOrdC: any;

  constructor(
    public formBuilder: FormBuilder,
    private ordenesComprasService: OrdenesCompraService,
    private alertasService: SwalComprsServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOrdenCompra();
  }

  /**
   * Emite la orden de compra al componente padre 
   * @param data datos de la orden de compra
   */
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

  /**
   * Recupera la orden de compra actual en base a la solicitud de compra 
   */  
  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response.data;
          this.setOrdenCompra(this.ordenCompra);
          
          this.isLoad = false;

          if (this.ordenCompra.documentos.length > 0) {
            this.hasFiles = true;
            // console.log(this.ordenCompra.documentos);
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
          this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
      }
    );
  }

  /**
   * Guarda los archivos de las facturas  PDF  y XML
   * @returns 
   */
  public guardarArchivos() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formDocsOrdenCompra.invalid) {
      this.alertasService.mostrarAlerta("Alerta", "Debes adjuntar la factura en ambos formatos", "warning", "warning");
      this.isLoad = false;
      return;
    }

    const idOrdenCompra = this.ordenCompra.id;

    this.formData.append("orden_compra_id", idOrdenCompra);

    this.ordenesComprasService.saveDocs(this.formData).subscribe(
      (response) => {
        if (response.status === "success") {

          this.getOrdenCompra();
          this.alertasService.mostrarAlerta("Guardado", "Documentos guardados correctamente", "success", "success");

          this.isLoad = false;
          this.formData = new FormData();
          this.submitted = false;
          this.formDocsOrdenCompra.reset();

        } else {
          this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
        
      }
    );
  }

  /**
   * Guarda los archivos de comprobante de pago
   * ->PDF
   * @returns 
   */
  public guardarComPago() {
    if (this.formData.has("comprobante_pago")) {

      const idOrdenCompra = this.ordenCompra.id;
      const idDocOC = this.ordenCompra.documentos[0].id;

      this.formData.append('archivo', this.formData.get('comprobante_pago'));
      this.formData.append('tipo_documento', 'comprobante_pago');
      this.formData.append("orden_compra_id", this.ordenCompra.id);
      this.formData.append("idFactura", idDocOC);
      
      this.ordenesComprasService.saveFacturaDocs(this.formData).subscribe(
        (response) => {
          if (response) {

            this.getOrdenCompra();
            this.alertasService.mostrarAlerta("Guardado", "Documentos guardados correctamente", "success", "success");

            this.isLoad = false;
            this.formData = new FormData();
            this.formDocsOrdenCompra.reset();
          } else {
            this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');

        }
      );
    } else {
      this.alertasService.mostrarAlerta("Alerta", "Debes adjuntar el comprobante pago", "warning", "warning");
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
            this.alertasService.mostrarAlerta("Listo", "Se ha marcado como pagada", "success", "success");
            this.isLoad = false;
            this.actualizarStatus.emit();
          } else {
            this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
        }
      );
  }

  /**
   * Lee el XML 
   * Lee los xmls de la orden de compra
   * Calcula la suma de los xml recuperados
   * Verifica cual es el método de pago
   */
  public leerXML() {
    this.mostrarDtsFac = false;
    this.ordenesComprasService.getDataXMLs(this.ordenCompra.id).subscribe(
      (response) => {
        if(response){
          // console.log(response);
          this.factura = response.factura;

          const tiposNecesarios = ["INGRESO", "COMPROBANTE PAGO"];

          if (this.validarTiposComprobante(this.factura.comprobantes, tiposNecesarios)) {
            this.hasComprobantePago = true;
          } else {
            this.hasComprobantePago = false;
          }


          this.checkMetodoPago();
        }
    },(error) => {
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
      });
    this.mostrarDtsFac = true;
  }

  private validarTiposComprobante(comprobantes, tiposRequeridos) {
    return tiposRequeridos.every(tipo =>
      comprobantes.some(c => c.tComprobanteDesc === tipo)
    );
  }

  /**
   * Verifica cual es el método de pago
   * PPD o PUE del xml
   */
  checkMetodoPago() {
    this.metodoPago = this.factura.metodoPago?.metodoPago;
    // console.log(this.metodoPago)
    if (this.metodoPago === "PPD") {
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
  }



  /**
   * Descarga  todas las facturas de la orden de compra en formato zip
   */
  public descargarFacturas() {
    this.ordenesComprasService.descargarFacturas(this.ordenCompra.id).subscribe((response) => {

        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Facturas_${this.ordenCompra.folio_oc}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
      });
  }

  /**
   * Recupera archivos de los inputs files
   * @param event archivo en el input
   * @param fieldName nombre del input
   */
  onFileChange1(event: any, fieldName: string) {
    this.formData.delete(fieldName);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
      if(fieldName === 'factura_xml'){
        this.validarXML(file);
      }
      
    }
    
  }

  /**
   *  Valida que el archivo que se suba sea un cfdi
   * y recupera el tipo de comprobante
  */ 
  validarXML(file: File) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const xmlContent = e.target?.result as string;
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

    const comprobante = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
    if (comprobante) {
      const tipo = comprobante.getAttribute("TipoDeComprobante");
      console.log("Tipo de comprobante:", tipo);
    } else {
      this.alertasService.mostrarAlerta('No valido', 'El archivo que intentas subir no es un CFDI'+
        "\n No se encontró el nodo 'cfdi:Comprobante'.",'error', 'danger');
      this.formDocsOrdenCompra.reset();
      console.warn("No se encontró el nodo 'cfdi:Comprobante'.");
    }
  };

  reader.readAsText(file);
}
}
