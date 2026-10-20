import { AfterViewInit, EventEmitter,Component, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormVendedoresComponent } from '../form-vendedores/form-vendedores.component';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { VendedoresService } from 'src/app/core/services/nissan/vendedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-update-vendedor',
  templateUrl: './modal-update-vendedor.component.html',
  styleUrl: './modal-update-vendedor.component.css'
})
export class ModalUpdateVendedorComponent implements AfterViewInit {

  constructor(
    public bsModalRef: BsModalRef,
    public alertas: SwalComprsServiceService,
    private vendedorService: VendedoresService
  ){}

  ngAfterViewInit(): void {
    if(this.datos){
      this.formVendedores.setValues();
    }
  }
  /** bandera para el manejo de botones durante la petición */
  public sending : boolean = false;
  
  /** Datos del elemento seleccionado de la tabla */
  public datos : any;
  public tiposVendedor : any = [];
  public departamentos : any = [];

  public event: EventEmitter<any> = new EventEmitter();

  /** Formulario de datos del vendedor */
  @ViewChild('formVendedores', { static: false }) formVendedores!:  FormVendedoresComponent;

  /** Guarda los valores del formulario */
  public save() {
    this.sending = true;
    if(!this.formVendedores.isValid()){
      this.alertas.mostrarAlerta('Cuidado!', 'Falta información, complétala para continuar',
         'warning', 'warning');
      this.sending = false;
      return;
    }

    const payload = this.formVendedores.getValues();
    this.vendedorService.update( this.datos.id, payload).subscribe((response:any)=>{
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

  public cerrarModal(): void {
    this.bsModalRef.hide();
  }
}
