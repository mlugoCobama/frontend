import { Component, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import { PermisosService } from "src/app/core/services/permisos.service";

@Component({
  selector: 'app-btn-atorizar-a-pago',
  templateUrl: './btn-atorizar-a-pago.component.html',
  styleUrl: './btn-atorizar-a-pago.component.css'
})
export class BtnAtorizarAPagoComponent {

  @Input() ordenCompra: any;
  @Output() actualizarStatus1 = new EventEmitter<void>();
  @Output() volver = new EventEmitter<void>();

  constructor(
    private alertasService: SwalComprsServiceService,
    private ordenesComprasService : OrdenesCompraService,
    private permisosService : PermisosService
  ){}

public solicitarPago() {
    Swal.fire({
      title: '¿Deseas solicitar el pago de la Orden de Compra?',
      text: 'Se autorizará la orden de compra seleccionada.',
      icon: 'info',
      showCancelButton: true,
      reverseButtons: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí, autorizar a pago',
      customClass: {
        cancelButton: 'btn btn-primary ms-2 px-4',
        confirmButton: 'btn btn-success ms-2 px-4',
      },
      buttonsStyling: false
    }).then((result) => {
      // Validamos únicamente si el usuario hizo clic en el botón de confirmación ("Sí")
      if (result.isConfirmed) {
        // this.isLoad = true;

        const payload = {
          id: this.ordenCompra.id,
        };

        // console.log(payload);
        this.ordenesComprasService.autorizarPagoOrdenCompra(payload).subscribe(
          (response) => {
            // this.isLoad = false;
            if (response.status === 'success') {
              this.actualizarStatus1.emit();
              this.volver.emit();

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

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}
