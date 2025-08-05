import { Component, Input, OnChanges, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

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
   private alertasService: SwalComprsServiceService
  ){}

  ngOnInit(): void {
    this.comprasService.actualizarEstatus$.subscribe(valor => { this.solicitudCompra.estatus =  valor } );
    console.log(this.solicitudCompra);
    
    // console.log(this.solicitudCompra);
  }

  //  ngOnChanges(changes: SimpleChanges): void {
  //    if(changes != null){
  //      console.log('SOLICITUD COMPRA',this.solicitudCompra);
  //      console.log('COTIZACION',this.cotizacion);
  //      console.log('BANDERA MOSTRAR TOTAL',this.mostrarTotal);

  //    }
  //  }

}
