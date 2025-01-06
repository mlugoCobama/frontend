import { Component, EventEmitter, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";

@Component({
  selector: 'app-modal-compras',
  templateUrl: './modal-compras.component.html',
  styleUrls: ['./modal-compras.component.css'],
  // standalone: true
})
export class ModalComprasComponent implements OnInit{
  // lo que recibo desde el compras component
  public id: any;
  public data: any;
  public folio: any;
  public usuario_solicita: any;
  public fecha: any;
  public usuario_destino: any;
  public motivo: any;
  // variables del componente
  public isLoad: boolean = true;
  public detalles: any;

    /**
   * variable para regresar el evento
   */ 
  public event: EventEmitter <any> = new EventEmitter();

  

  
  constructor(
    private comprasService: ComprasService,
    public modalRef: BsModalRef) 
    { }
    public ngOnInit(): void {
      this.getDetalle();
    }

  public cerrarModal(): void{
    this.modalRef.hide();
  }
  
  private getDetalle() {
    this.comprasService.getOne(this.id).subscribe(
      (response) => {
        if (response) {
          this.detalles = response.data;
          this.isLoad = false;
          console.log(this.detalles)
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

}
