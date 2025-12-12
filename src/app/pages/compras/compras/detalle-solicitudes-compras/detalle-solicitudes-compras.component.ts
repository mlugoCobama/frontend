import { Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ComprasService } from 'src/app/core/services/compras/compras.service';
import { EstadoSolicitud } from '../estado-solicitud.enum';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { TableDetallesSolicitudComponent } from './table-detalles-solicitud/table-detalles-solicitud.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-detalle-solicitudes-compras',
  templateUrl: './detalle-solicitudes-compras.component.html',
  styleUrl: './detalle-solicitudes-compras.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // cuando aparece
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('680ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [ // cuando desaparece
        animate('680ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]

})
export class DetalleSolicitudesComprasComponent implements OnInit{
@ViewChild("tableDetalles", { static: false })
  tableDetalles!: TableDetallesSolicitudComponent;
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
  this.modalRef = this.modalService.show(content, { class: "modal-lg" });
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
  this.tableDetalles.getProveedoresCotizacion();
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
