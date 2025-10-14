import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
@Component({
  selector: 'app-btn-atorizar-a-pago',
  templateUrl: './btn-atorizar-a-pago.component.html',
  styleUrl: './btn-atorizar-a-pago.component.css'
})
export class BtnAtorizarAPagoComponent {

  @Input() ordenCompra: any;
  @Output() actualizarStatus1 = new EventEmitter<void>();

  constructor(
    private alertasService: SwalComprsServiceService,
    private ordenesComprasService : OrdenesCompraService
  ){}

    public solicitarPago() {
      Swal.fire({
        title: '¿Deseas solicitar el pago de la Orden de Compra?',
        text: 'Asigna la modalidad de pago previamente acordada con el proveedor seleccionado:',
        input: 'select',
        inputOptions: {
          1: '---CONTADO---',
          2: '---CREDITO---',
        },
        inputPlaceholder: 'Selecciona una opción',
        inputAttributes: {
          autocapitalize: 'off'
        },
        icon: 'info',
        confirmButtonText: 'Sí, autorizar a pago',
        showCancelButton: true,
        cancelButtonText: 'No',
        customClass: {
          confirmButton: 'btn btn-success px-4',
          cancelButton: 'btn btn-primary ms-2 px-4',
        },
        buttonsStyling: false,
        preConfirm: (razon) => {
          if (!razon || razon.trim() === '') {
            Swal.showValidationMessage('Debes de seleccionar una forma de pago para continuar');
            return false;
          }
          return razon;
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          // this.isLoad = true;
    
          const payload = {
            id: this.ordenCompra.id,
            modo_pago : result.value
          };
     
          console.log(payload);
          this.ordenesComprasService.autorizarPagoOrdenCompra(payload).subscribe(
            (response) => {
              // this.isLoad = false;
              if (response.status === 'success') {
               this.actualizarStatus1.emit();
      
                this.alertasService.mostrarAlerta(
                  'Listo!',
                  response.message,
                  'success',
                  'success'
                );
              } else {
                this.alertasService.mostrarAlerta(
                  'Error!',
                  'Ocurrió un error inesperado',
                  'error',
                  'danger'
                );
              }
            },
            (error) => {
              // this.isLoad = false;
              this.alertasService.mostrarAlerta(
                'Error!',
                error,
                'error',
                'danger'
              );
            }
          );
        }
      });
    }
}
