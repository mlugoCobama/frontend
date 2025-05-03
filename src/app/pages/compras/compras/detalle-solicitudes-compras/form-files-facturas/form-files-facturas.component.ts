import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";


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
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getOrdenCompra();
    console.log("Inicio el componente de facturas")
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
          console.log(this.ordenCompra);
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
   * ->PDF
   * y XML
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
   * ->PDF
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
          this.checkMetodoPago();
        }
    });
    this.mostrarDtsFac = true;
  }

  /**
   * Verifica cual es el método de pago
   * PPD o PUE del xml
   */
  checkMetodoPago() {
    this.metodoPago = this.factura.metodoPago?.metodoPago;
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
    }
  }
}
