import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

import Swal from 'sweetalert2';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-btns-autorizacion',
  templateUrl: './btns-autorizacion.component.html',
  styleUrl: './btns-autorizacion.component.css'
})
export class BtnsAutorizacionComponent implements OnInit {

  @Input() solicitudCompra:any;

  @Output() actualizarStatus = new EventEmitter<void>();
  @Output() setDataOrdenCompra = new EventEmitter<void>();

  public ordenCompra: any;
  public isLoad: boolean = false;

  constructor(
    public ordenesComprasService: OrdenesCompraService,
    private alertasService:SwalComprsServiceService,
    private permisosService: PermisosService,
  ){}

  ngOnInit(): void {
     this.getOrdenCompra();
  }

  setOrdenCompra(data: any) {
    this.setDataOrdenCompra.emit(data);
  }

  /**
   * Maneja la función de cancelar una orden
   */ 
  public  cancelarOrden1() {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "La orden será cancelada",
      icon: "error",
      confirmButtonText: " SI ",
      showCancelButton: true,
      cancelButtonText: " NO ",
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.ordenesComprasService.destroy(this.solicitudCompra.id).subscribe(
          (response) => {
            if (response.status === "success") {
              this.alertasService.mostrarAlerta("Cancelada!", "La orden ha sido cancelada.","success","success");
              this.actualizarStatus.emit();
            } else {
              this.alertasService.mostrarAlerta("Error!", response.message,"error","danger");
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger");
          }
        );
      }

    });
  }  

  public cancelarOrden() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La orden de compra sera rechazada. Por favor ingresa la razón:',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      icon: 'warning',
      confirmButtonText: 'Sí, rechazar',
      showCancelButton: true,
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-danger px-4',
        cancelButton: 'btn btn-primary ms-2 px-4',
      },
      buttonsStyling: false,
      preConfirm: (razon) => {
        if (!razon || razon.trim() === '') {
          Swal.showValidationMessage('Debes ingresar una razón válida');
          return false;
        }
        return razon;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.isLoad = true;
  
        const payload = {
          id: this.solicitudCompra.id,
          razonCancelacion: result.value
        };
  
        this.ordenesComprasService.destroy(payload).subscribe(
          (response) => {
            this.isLoad = false;
            if (response.status === 'success') {
              this.actualizarStatus.emit();
    
              this.alertasService.mostrarAlerta(
                'Cancelada!',
                'La orden ha sido cancelada.',
                'success',
                'success'
              );
            } else {
              this.alertasService.mostrarAlerta(
                'Error!',
                'Ocurrió un error inesperado',
                'error',
                'error'
              );
            }
          },
          (error) => {
            this.isLoad = false;
            this.alertasService.mostrarAlerta(
              'Error!',
              error,
              'error',
              'error'
            );
          }
        );
      }
    });
  }
  
  /**
  * Maneja la función de autorizar una orden
  * SI-Enviar solicitud de compra a proveedor
  * NO-Autorizar unicamente
  */
  public  autorizarOrden() {
    const data = {
      idSolicituCompra: this.solicitudCompra.id,
      idOrdenCompra: this.ordenCompra.id,
    };
    Swal.fire({
      title: "Ya casi!!",
      text: "Deseas enviar la solicitud de surtido al proveedor?",
      icon: "info",
      showDenyButton: true,
      confirmButtonText: " SI, Enviar... ",
      denyButtonText: `NO, Solo autorizar`,
      customClass: {
        confirmButton: "btn btn-success px-4",
        denyButton: "btn btn-info ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenesComprasService.enviarSolicitudSurtido(data).subscribe(
          (response) => {
            if (response.status === "success") {
              this.alertasService.mostrarAlerta("Enviada!!", "La orden de compra ha sido autorizada y enviada al proveedor.","success","success");
              this.actualizarStatus.emit();
              this.getOrdenCompra();
            } else {
              this.alertasService.mostrarAlerta("Error!", response.message,"error","danger");
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger");
          }
        );
      } else if (result.isDenied) {
        this.ordenesComprasService.autorizarOrdenCompra(data).subscribe(
          (response) => {
            if (response.status === "success") {
              this.alertasService.mostrarAlerta("Orden autorizada", "La orden sera marcada como autorizada","success","success");
              this.actualizarStatus.emit();
              this.getOrdenCompra();
            } else {
              this.alertasService.mostrarAlerta("Error!", response.message,"error","danger");
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger");
          }
        );
      }
    });
  }  
  
  /**
  * Recupera la orden de compra
  */  
  private getOrdenCompra() {
    this.ordenesComprasService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.ordenCompra = response.data;
          this.setOrdenCompra(this.ordenCompra);
          this.isLoad = true;
        } else {
          this.alertasService.mostrarAlerta("Error!", response.message,"error","danger");
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!",`Error fetching data: ${error}`, "error", "danger");
      }
    );
  }  

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }
}
