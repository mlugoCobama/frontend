import { Component, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormComplementoComponent } from '../form-complemento/form-complemento.component';

import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: 'app-modal-add-complemento',
  templateUrl: './modal-add-complemento.component.html',
  styleUrl: './modal-add-complemento.component.css'
})

export class ModalAddComplementoComponent {

 public id: any;
 public idOrdenCompra: any;
 public submitted:boolean = false;

 public event: EventEmitter<any> = new EventEmitter();
  @ViewChild('formComplemento') formComplemento!:  FormComplementoComponent;
 
 constructor(
  public modalRef: BsModalRef,
  private ordenesComprasService: OrdenesCompraService,
  private alertasService: SwalComprsServiceService

 ){}

 public cerrarModal(): void {
    this.modalRef.hide();
  }

  public save(){
    this.submitted = true;

    if(!this.formComplemento.esValido()){
      this.alertasService.mostrarAlerta('error', 'Llena correctamente los archivos', 'error', 'danger');
      this.submitted = false;
      return
    }
    
    const data = this.getData();

      this.ordenesComprasService.saveDocs1(this.id, data).subscribe(
        (response) => {
          if (response.status === "success") {

            // this.getOrdenCompra();
            this.alertasService.mostrarAlerta("Guardado", "Documentos guardados correctamente", "success", "success");

            this.formComplemento.resetearFormulario();
            this.submitted = false;
            this.event.emit();
            this.cerrarModal();
        
          } else {
            this.submitted = false;
            this.alertasService.mostrarAlerta('error', response.message, 'error', 'danger');
          }
        },
        (error) => {
          this.submitted = false;
          this.alertasService.mostrarAlerta('error',` "Error:" ${error}`, 'error', 'danger');
        }
      );
  }

  private getData(){
    const formData = new FormData;
    
    const files = this.formComplemento.obtenerValores()
    formData.append('id', this.id);
    formData.append('complemento_pago_xml', files.get('complemento_pago_xml'));
    formData.append('complemento_pago_pdf', files.get('complemento_pago_pdf'));
    formData.append("_method", "PUT");
    formData.append("orden_compra_id", this.idOrdenCompra);
    
    return formData;
  } 
}

