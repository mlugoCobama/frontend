import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";

@Component({
  selector: "app-datos-facturas",
  templateUrl: "./datos-facturas.component.html",
  styleUrl: "./datos-facturas.component.css",
})
export class DatosFacturasComponent {

   constructor(
      private proveedoresService: ProveedoresService
    ) {}
    
  @Input() mostrarDtsFac: any; //Bandera para mostrar o no los datos de la factura

  @Input() ordenCompra: any;

  @Input() factura: any; // Datos de la factura

    /**
   * Llama el service para abrir el archivo 
   */ 
    verArchivos(prov: any) {
    
      this.proveedoresService.abrirArchivo(prov);
  
    }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
}
