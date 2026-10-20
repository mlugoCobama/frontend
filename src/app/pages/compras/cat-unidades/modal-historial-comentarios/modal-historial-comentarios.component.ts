import { Component, EventEmitter, ViewChild, AfterViewInit, OnInit  } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-modal-historial-comentarios',
  templateUrl: './modal-historial-comentarios.component.html',
  styleUrl: './modal-historial-comentarios.component.css'
})
export class ModalHistorialComentariosComponent implements OnInit{
      public unidad: any;

  public comentarios: any;

  public isLoad:boolean =  true;
  public showTable:boolean =  false;

  public event: EventEmitter<any> = new EventEmitter();
  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public deshabilitado: boolean = false;

    constructor(
      public bsModalRef: BsModalRef,
      private unidades: UnidadesService, 
      private alertasService: SwalComprsServiceService
    ){}

    ngOnInit(): void {
      this.getCatVehiculos(this.unidad.id);
    }

    public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => { this.modalCerrado.emit() }, 150);
    }

    private getCatVehiculos(id) {
    
    this.isLoad = true;
    this.showTable =  false;
    this.unidades.getComentarios(id).subscribe(
      (response) => {
            if (response) {
              this.comentarios = response.data;
              this.isLoad = false;
              this.showTable = true;
              
            } else {
              this.alertasService.mostrarAlerta("Error", response.message, "error" , "danger" );
              this.showTable =  false;
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta("Error", `Error fetching data: ${error}`, "error" , "danger" );
            this.showTable =  false;
          }
        );
        
      }
}
