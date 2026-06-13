import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { FormSalidaInventarioComponent } from '../form-salida-inventario/form-salida-inventario.component';

@Component({
  selector: 'app-modal-salida-inventario',
  templateUrl: './modal-salida-inventario.component.html',
  styleUrl: './modal-salida-inventario.component.css'
})
export class ModalSalidaInventarioComponent implements AfterViewInit {
  public event: EventEmitter<any> = new EventEmitter();

  public tecnicos: any = [];
  public data: any = [];
  public isLoad : any = false;

  public showPreview = false;
  public mostrarPreview = false;

  @ViewChild('formSalidaInventario', { static: false }) formSalidaInventario!:  FormSalidaInventarioComponent;

  constructor(
    public modalRef: BsModalRef,
    private almacenService: AlmacenService,
    private alertasService: SwalComprsServiceService

  ) {}

  ngAfterViewInit(): void {
    this.getExistencias();
  }

  ngOnDestroy() {

  }

  private getExistencias() {
    this.isLoad = true;
    this.almacenService.getExistencias().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
          this.isLoad = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
          this.isLoad = false;
        }
    );
  }

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

  public guardarDatos(){
    const values = this.formSalidaInventario.onSubmit();
    if(values){
      this.almacenService.storeMovimientos(values).subscribe(
        (response) => {
          if (response) {
            this.alertasService.mostrarAlerta("Listo","Movimientos realizados correctamente","success","success");
            this.data = response.data;
            this.isLoad = false;
            this.event.emit(true);
            this.cerrarModal();
          } else {
            this.alertasService.mostrarAlerta("Error",response.message,"error","danger");
            this.isLoad = false;
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta("Error",`Error fetching data: ${error}`,"error","danger");
            this.isLoad = false;
          }
      );
    }
  }
}
