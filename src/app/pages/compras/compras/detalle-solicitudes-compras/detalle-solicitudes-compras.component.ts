import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { EstadoSolicitud } from '../estado-solicitud.enum';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-detalle-solicitudes-compras',
  templateUrl: './detalle-solicitudes-compras.component.html',
  styleUrl: './detalle-solicitudes-compras.component.css'
})
export class DetalleSolicitudesComprasComponent implements OnInit{

 @Input() solicitudCompra:any;
 @Input() status:any;
 @Input() modifica:any;
 public tipo =  null;

 @Output() udtStatus = new EventEmitter<number>();

 public cotizacion:any;
 public ordenCompra:any;
 public enEsts = EstadoSolicitud;
 public selectedImage: any;
 public modalRef?: BsModalRef;

 mostrarCotizacionFlag: boolean = false;
 public mostrarTotal : boolean = false;

 constructor(
     private modalService: BsModalService,
     private comprasService: ComprasService,
     private alertasService: SwalComprsServiceService
   ) {}

   ngOnInit(): void {
    this.comprasService.actualizarEstatus$.subscribe((valor) => { this.solicitudCompra.estatus =  valor } );
    this.comprasService.mostrarCotizacion$.subscribe((mostrar) => { this.mostrarCotizacionFlag = mostrar; });
   }

 /**
  * Abre un modal con una imagen de referencia
  */
 public openModal(content: any, imgReferencia: string) {
  this.selectedImage = imgReferencia;
  this.modalRef = this.modalService.show(content, { class: "modal-sm" });
}

/**
 * Asigna un valor a cotización
 * @param data valor que recibe 
 */ 
public setDataCotizacion(data:any) {
  this.cotizacion = data;
}

/**
 * Asigna un valor a OrdenCompra
 * @param data valor que recibe 
 */ 
public setDataOrdenCompra(data:any) {
  this.ordenCompra = data;
}
/**
 * Asigna un valor a MostrarTotal
 * @param data valor que recibe 
 */ 
public setMostrarTotal(data:any) {
  this.mostrarTotal = data;
}

/**
 * Actualiza el estatus de la solicitud de compra
 */  
public updateStatus() {
  this.comprasService.getSolicitudCompra(this.solicitudCompra.id).subscribe(
    (response) => {
      if (response) {
        this.solicitudCompra = response.data;
        this.udtStatus.emit(Number(this.solicitudCompra.estatus));
        // console.log('se esta ejecutando update status');
        // this.udtStatus.emit(Number(this.solicitudCompra.estatus));
      } 
    },
    (error) => {
      this.alertasService.mostrarAlerta("Error", error, "error", "danger");
    }
  )
}  
}
