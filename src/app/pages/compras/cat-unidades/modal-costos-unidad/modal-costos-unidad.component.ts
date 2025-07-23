import { Component, OnInit,  EventEmitter,} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-modal-costos-unidad',
  templateUrl: './modal-costos-unidad.component.html',
  styleUrl: './modal-costos-unidad.component.css'
})
export class ModalCostosUnidadComponent implements OnInit{
  
  public unidad: any;

  public gastos: any;

  public isLoad:boolean =  true;
  public showTable:boolean =  false;

   public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef,
    private unidades : UnidadesService,
    private alertasService : SwalComprsServiceService,
  ){};

  ngOnInit(): void {
    this.getCatVehiculos(this.unidad.id
    );
  }

  public deshabilitado: boolean = false;

  public cerrarModal(): void {
    this.bsModalRef.hide();
    // setTimeout(() => {this.modalCerrado.emit();}, 150)
    }

  private getCatVehiculos(id) {
    
    this.isLoad = true;
    this.showTable =  false;
    this.unidades.getGastosVehiculo(id).subscribe(
      (response) => {
            if (response) {
              this.gastos = response.data;
              console.log(this.gastos);
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
