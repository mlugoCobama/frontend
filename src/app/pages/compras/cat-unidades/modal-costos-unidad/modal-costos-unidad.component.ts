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
   public modalCerrado: EventEmitter<any> = new EventEmitter();

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
    setTimeout(() => { this.modalCerrado.emit() }, 150);
    
    }

  private getCatVehiculos(id) {
    
    this.isLoad = true;
    this.showTable =  false;
    this.unidades.getGastosVehiculo(id).subscribe(
      (response) => {
            if (response) {
              this.gastos = response.data;
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

  descargandoExcel = false;
  descargarGastos(): void {
  if (this.descargandoExcel) {
    this.descargandoExcel = false;
    return;
  }

  this.descargandoExcel = true;

  const nombreArchivo = `Gastos_Vehiculo_${this.unidad.eco}_${this.unidad.entidad} _${this.unidad.no_serie}.xlsx`;

  this.unidades.descargarGastosUnidad(this.unidad.id)
    .subscribe({
      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.descargandoExcel = false;
      },

      error: (error) => {
        this.descargandoExcel = false;
        console.error(error);
      }

    });

}
}
