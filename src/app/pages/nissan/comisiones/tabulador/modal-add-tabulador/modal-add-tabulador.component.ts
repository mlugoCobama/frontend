import { AfterViewInit, Component, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { TabuladorService } from 'src/app/core/services/nissan/tabulador.service';
import { FormTabuladorComponent } from '../form-tabulador/form-tabulador.component';

@Component({
  selector: 'app-modal-add-tabulador',
  templateUrl: './modal-add-tabulador.component.html',
  styleUrl: './modal-add-tabulador.component.css'
})
export class ModalAddTabuladorComponent implements AfterViewInit {

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private tabuladorService: TabuladorService
  ){}

  ngAfterViewInit(): void {}

  /** bandera para el manejo de botones durante la petición */
  public sending : boolean = false; 

  public event: EventEmitter<any> = new EventEmitter();
  
  /** Formulario de datos del tabulador */
  @ViewChild('formTabulador', { static: false }) formTabulador!:  FormTabuladorComponent;

  /**
   * Guarda los valores del formulario
   */
  public save() {
    this.sending = true;
    if(!this.formTabulador.isValid()){
      this.alertas.mostrarAlerta('Cuidado!', 'Falta información, complétala para continuar',
         'warning', 'warning');
      this.sending = false;
      return;
    }

    const payload = this.formTabulador.getValues();
    this.tabuladorService.store(payload).subscribe((response:any)=>{
      if(response.status = 'success'){
        this.alertas.mostrarAlerta('Listo!', response.message, 'success', 'success');
        this.sending = false;
        this.event.emit();
        this.cerrarModal();
      }else{
        this.alertas.mostrarAlerta('Error!', response.message, 'error', 'danger');
        this.sending = false;
      }
    },(error) => {
        console.error("Error fetching data:", error);
        this.alertas.mostrarAlerta('Error!', error, 'error', 'danger');
        this.sending = false;
    });
  }

  /** Cierra el modal */
  public cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
