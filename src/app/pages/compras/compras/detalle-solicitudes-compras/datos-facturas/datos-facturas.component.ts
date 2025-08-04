import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalAddComplementoComponent } from "./modal-add-complemento/modal-add-complemento.component";
@Component({
  selector: "app-datos-facturas",
  templateUrl: "./datos-facturas.component.html",
  styleUrl: "./datos-facturas.component.css",
})
export class DatosFacturasComponent {

   constructor(
      private proveedoresService: ProveedoresService,
      private docsService: OrdenesCompraService,
      private modalService: BsModalService
    ) {}

  public modalRef?: BsModalRef;

  @Input() mostrarDtsFac: any; //Bandera para mostrar o no los datos de la factura

  @Input() ordenCompra: any;

  @Input() factura: any; // Datos de la factura

  @Input() metodoPago:any;

  @Output() getOrdenCompra = new EventEmitter<void>();

    /**
   * Llama el service para abrir el archivo 
   * @param prov ruta del archivo
   */ 
    verArchivos(prov: any) {
    
      this.proveedoresService.abrirArchivo(prov);
  
    }

    descargarXML(file, tipo, fileName) {
      this.docsService.downloadXML(file).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tipo}_folio_${fileName}.xml`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

    openModalAddFile(id){

      const initialState: ModalOptions = {
            initialState: {
              id: id,
              idOrdenCompra:  this.ordenCompra.id

            },
            class: "modal-lg",
          };
          this.modalRef = this.modalService.show(
            ModalAddComplementoComponent,
            initialState
          );
          this.modalRef.content.closeBtnName = "Close";
          this.modalRef.content.event.subscribe(() => {
            this.getOrdenCompra.emit();
            // this.isLoad = true;
            // this.getAll();
          });
    }
}
