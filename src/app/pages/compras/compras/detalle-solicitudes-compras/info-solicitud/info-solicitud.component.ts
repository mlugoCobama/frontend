import { Component, Input, OnChanges, SimpleChanges, EventEmitter, OnInit, Output } from '@angular/core';
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import catCentrosCostos from "src/environments/cat_centros_costos.json";
import { SolicitudCompra } from 'src/app/core/models/compras/solicitud-compra';

@Component({
  selector: 'app-info-solicitud',
  templateUrl: './info-solicitud.component.html',
  styleUrl: './info-solicitud.component.css'
})
export class InfoSolicitudComponent implements OnInit{
  @Input() solicitudCompra!: any;
  @Input() mostrarTotal:boolean = false;
  @Input() cotizacion:any;
  @Input() tienePermiso:any;
  @Output() openEdicionSolicitud = new EventEmitter<void>();
 public centrosCostos:any = catCentrosCostos;

  constructor(
   private comprasService: ComprasService,
   private proveedoresService: ProveedoresService
  ){}

  ngOnInit(): void {
    console.log(this.solicitudCompra)
    console.log(this.cotizacion)
    this.comprasService.actualizarEstatus$.subscribe(valor => this.solicitudCompra.estatus = valor);
  }

  clickEditarSolicitud() {
      this.openEdicionSolicitud.emit();
  }

    /**
   * Llama el service para abrir el archivo
   * @param prov ruta del archivo
   */
    verArchivos(prov: any) {

      this.proveedoresService.abrirArchivo(prov);

    }
}
