import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import Swal from 'sweetalert2';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-btn-finalizar-compra',
  templateUrl: './btn-finalizar-compra.component.html',
  styleUrl: './btn-finalizar-compra.component.css'
})
export class BtnFinalizarCompraComponent implements OnInit{

  @Input() ordenCompra:any;
  @Output() actualizarStatus1 = new EventEmitter<void>();

  constructor(
    private ordenesCompra: OrdenesCompraService,
    private alertasService: SwalComprsServiceService, 
    private permisosService : PermisosService
  ){}

  ngOnInit(): void {
    // console.log(this.ordenCompra);
  }

    public finalizarOrdenCompra() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'La compra sera marcada como finalizada:',
        inputAttributes: {
          autocapitalize: 'off'
        },
        icon: 'warning',
        confirmButtonText: 'Sí, Finalizar',
        showCancelButton: true,
        cancelButtonText: 'No',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn btn-primary ms-2 px-4',
          cancelButton: 'btn btn-danger ms-2 px-4',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.ordenesCompra.finalizarCompra(this.ordenCompra?.id).subscribe(
            (response) => {
              if (response) {
                this.actualizarStatus1.emit();
      
                this.alertasService.mostrarAlerta(
                  'Finalizada!',
                  'Se ha marcado como finalizada.',
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

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

}
