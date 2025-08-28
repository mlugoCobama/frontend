import { Component, Input, OnChanges, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import catCentrosCostos from "src/environments/cat_centros_costos.json";

@Component({
  selector: 'app-info-solicitud',
  templateUrl: './info-solicitud.component.html',
  styleUrl: './info-solicitud.component.css'
})
export class InfoSolicitudComponent implements OnInit{
  @Input() solicitudCompra:any;//Datos de 
  @Input() mostrarTotal:any;
  @Input() cotizacion:any;

 public centrosCostos:any = catCentrosCostos;

  constructor(
   private comprasService: ComprasService,
   private alertasService: SwalComprsServiceService,
   private proveedoresService: ProveedoresService
  ){}

  ngOnInit(): void {
    this.comprasService.actualizarEstatus$.subscribe(valor => { this.solicitudCompra.estatus =  valor } );
  }

      /**
   * Llama el service para abrir el archivo 
   * @param prov ruta del archivo
   */ 
    verArchivos(prov: any) {
    
      this.proveedoresService.abrirArchivo(prov);
  
    }
}
