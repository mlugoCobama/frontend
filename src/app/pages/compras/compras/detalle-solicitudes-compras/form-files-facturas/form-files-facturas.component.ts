import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PanelEntregasComponent } from "../panel-entregas/panel-entregas.component";
import { FormComplementoComponent } from "../datos-facturas/form-complemento/form-complemento.component";
import { ValidadorCFDI } from "src/app/core/helpers/cfdi-validador";

@Component({
  selector: "app-form-files-facturas",
  templateUrl: "./form-files-facturas.component.html",
  styleUrl: "./form-files-facturas.component.css",
})
export class FormFilesFacturasComponent implements OnInit {
  selectedTab: string = '';
  public modelTabs = [];

  @ViewChild('formComplemento') formComplemento!:  FormComplementoComponent;

  @Input() solicitudCompra: any;
  @Output() actualizarStatus = new EventEmitter<void>();
  @Output() setDataOrdenCompra = new EventEmitter<void>();
  
  loadingArchivos = false;
  loadingComPago = false;
  loadingComplementos = false;
  loadingDescargas = false;


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

  inicializarTabs() {
  const isCredito = this.ordenCompra?.modo_pago == 2;
  const pasoFactura = isCredito ? 1 : 2;
  const pasoPago = isCredito ? 2 : 1;
  const pasoComplemento = isCredito ? 3 : null;

  this.modelTabs = [
    { tabName: 'upFactura', tabLabel: 'Subir Factura', hidden: false, orden: pasoFactura, tipoDocumento: 'INGRESO' },
    { tabName: 'upPago', tabLabel: 'Subir Comprobante de Pago', hidden: false, orden: pasoPago, tipoDocumento: 'COMPROBANTE PAGO' },
    { tabName: 'upComplemento', tabLabel: 'Subir Complemento de Pago', hidden: !isCredito, orden: pasoComplemento, tipoDocumento: 'PAGO' },
  ];

  this.modelTabs = this.modelTabs
    .filter(tab => tab.orden !== null)
    .sort((a, b) => a.orden - b.orden)
    .map(tab => ({ ...tab, paso: tab.orden }));

    this.setFirstTab();
}

/**
 * Fija el tab seleccionado en el ultimo tab valido o el primero
 */
setFirstTab(){
  
  const firstEnabledTab = this.modelTabs.find(tab => !this.validarDocumento(tab.tipoDocumento));
  this.selectedTab = firstEnabledTab ? firstEnabledTab.tabName : this.modelTabs[0].tabName;
}

/**
 * Valida que exista el tipo de comprobante dentro del array
 * @param tipoDocumento tipo de comprobante: (INGRESO, COMPROBANTE PAGO, PAGO)
 * @returns boolean true o false
 */
validarDocumento(tipoDocumento: string){
  let hasDocumento = false;
  let entregaParcial =  this.validarTotales( this.factura.sumaTotal, this.solicitudCompra.total_orden );
  if(tipoDocumento != 'PAGO' && !entregaParcial){ 
    hasDocumento = this.factura.comprobantes?.some(c => c.tComprobanteDesc === tipoDocumento);
  }
  // console.log('entregaParcial',entregaParcial);
  // console.log('Has Documento',hasDocumento);
  return hasDocumento;  
}

/**
 * Recupera la primera factura de tipo ingreso como referencia para el complemento de pago
 * @returns objeto {UUID,fecha,folioforma,Pago,idRuta,moneda,representacion_impresa,
 *  serie, subTotal, tComprobante, total, xml}
 */
getFacturaReferencia(){
  const facturaReferencia = this.factura.comprobantes?.find(c => c.tComprobanteDesc == 'INGRESO');
  return facturaReferencia;
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

            const ultimoIndex = this.ordenCompra.documentos.length;
            const ultimoId = this.ordenCompra.documentos[ultimoIndex - 1].id;
            const comprobantePago = this.ordenCompra.documentos[ultimoIndex - 1].comprobante_pago;

            if (comprobantePago) {
              this.hasComprobantePago = true;
              this.habilitado = true;
            }

            this.leerXML();

            this.hasFacturas = true;

            if (comprobantePago) {
              this.hasComprobantePago = true;
              this.habilitado = true;
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

          if(this.ordenCompra.tipo_pago === 'Contado' && this.ordenCompra.documentos.length === 0 ){
              this.hasComprobantePago = false;
          }

          this.inicializarTabs();
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
    this.loadingArchivos = true;

    if (this.formDocsOrdenCompra.invalid) {
      this.alertasService.mostrarAlerta("Alerta", "Debes adjuntar la factura en ambos formatos", "warning", "warning");
      this.isLoad = false;
      this.loadingArchivos = false;
      return;
    }

    const idOrdenCompra = this.ordenCompra.id;
    this.formData.append("orden_compra_id", idOrdenCompra);

    this.formData.append("total_compra", this.solicitudCompra.total_orden);
    this.formData.append("suma_facturas", this.factura.sumaTotal);

    this.ordenesComprasService.saveDocs(this.formData).subscribe(
      (response) => {
        if (response.status === "success") {

          this.getOrdenCompra();
          this.alertasService.mostrarAlerta("Guardado", "Documentos guardados correctamente", "success", "success");

          this.isLoad = false;
          this.formData = new FormData();
          this.submitted = false;
          this.formDocsOrdenCompra.reset();
          this.loadingArchivos = false;
        } else {
          this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
          this.loadingArchivos = false;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
        this.loadingArchivos = false;
        
      }
    );
  }

  /**
   * Guarda los archivos de comprobante de pago
   * ->PDF
   * @returns 
   */
  public guardarComPago() {
    this.loadingComPago = true;
    if (this.formData.has("comprobante_pago")) {

      const idOrdenCompra = this.ordenCompra.id;
      const idDocOC = this.ordenCompra?.documentos[0]?.id === undefined ? null : this.ordenCompra?.documentos[0]?.id;

      if(idDocOC){
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
              this.loadingComPago = false
            } else {
              this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
              this.loadingComPago = false
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
            this.loadingComPago = false

          }
        );
      }else{

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
          this.loadingComPago = false
        } else {
          this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
          this.loadingComPago = false
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
        this.loadingComPago = false
      }
    );

      }

    } else {
      this.alertasService.mostrarAlerta("Alerta", "Debes adjuntar el comprobante pago", "warning", "warning");
      this.isLoad = false;
      this.loadingComPago = false
      return;
    }
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

          if(this.ordenCompra.tipo_pago === "Credito"){
            if (this.validarTiposComprobante(this.factura.comprobantes, tiposNecesarios)) {
             this.hasComprobantePago = true;
           } else {
             this.hasComprobantePago = false;
           }
          }
          this.setFirstTab();
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
    const existeIngreso = this.factura.comprobantes?.some(c => c.tComprobante === "I");
    // console.log(this.metodoPago)
    if (this.metodoPago === "PPD" || this.metodoPago === '' || this.metodoPago === undefined || this.metodoPago === null) {
      if(!existeIngreso){
        this.habilitado = true;
      }
      this.habilitado = true;
    } else {
      this.habilitado = false;
    }
  }



  /**
   * Descarga  todas las facturas de la orden de compra en formato zip
   */
  public descargarFacturas() {
    this.loadingDescargas = true;
    this.ordenesComprasService.descargarFacturas(this.ordenCompra.id).subscribe((response) => {
        const blob = new Blob([response], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Facturas_${this.ordenCompra.folio_oc}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loadingDescargas = false;
      },
      (error) => {
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
          this.loadingDescargas = false;
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
    if (file) {
        ValidadorCFDI.esCFDI(file).then((esValido) => {
          if (!esValido) {
            this.alertasService.mostrarAlerta('No valido', 'El archivo que intentas subir no es un CFDI'+
            "\n No se encontró el nodo 'cfdi:Comprobante'.",'error', 'danger');
            this.formDocsOrdenCompra.reset();
            this.formData = new FormData();
          } else {
            console.info('CFDI VALIDO');
          }
        });
      }
  }

public actualizadorEstatus(){ 
  this.actualizarStatus.emit();
  this.ordenCompra = [];
  this.getOrdenCompra();
}

public save(){
    this.loadingComplementos = true;

    if(!this.formComplemento.esValido()){
      this.alertasService.mostrarAlerta('error', 'Llena correctamente los archivos', 'error', 'danger');
      this.loadingComplementos = false;
      return
    }
    const data = this.getData();
    this.ordenesComprasService.saveFacturaDocs(data).subscribe(
      (response) => {
        if (response) {
          this.alertasService.mostrarAlerta("Guardado", "Documentos guardados correctamente", "success", "success");

          this.formComplemento.resetearFormulario();
          this.getOrdenCompra();
          this.loadingComplementos = false;
        } else {
          this.loadingComplementos = false;
          this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
        }
      },
      (error) => {
        this.loadingComplementos = false;
        this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
      }
    );
  }

  private getData(){
    const formData = new FormData;
    const files = this.formComplemento.obtenerValores();
    const tipo_documento =  this.formComplemento.obtenerSelect();
    formData.append('idFactura', this.getFacturaReferencia().idRuta);
    formData.append('tipo_documento', tipo_documento);
    if(tipo_documento != 'comprobante_pago'){
      formData.append('archivo_xml', files.get('archivo_xml'));
    }
    formData.append('archivo', files.get('archivo'));
    // formData.append("_method", "PUT");
    formData.append("orden_compra_id", this.ordenCompra.id);
    return formData;
  } 

  validarTotales(impTotalXML, impTotalOC) {
  // Redondear a un decimal
  const xml = Number(Math.ceil(impTotalXML));
  const oc  = Number(Math.ceil(impTotalOC));

    console.log('total xml', xml, 'total', oc);

    if (xml === 0) return true;            // No pagado
    if (xml < oc) return true;             // Pagado parcialmente
    if (xml === oc) return false;          // Pagado completamente
    return false;                          // Revisar discrepancias
  }



}
