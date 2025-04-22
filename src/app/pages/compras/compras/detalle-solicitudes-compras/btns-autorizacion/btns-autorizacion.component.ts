import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { OrdenesCompraService } from 'src/app/core/services/compras/ordenesCompra/ordenes-compra.service';

import Swal from 'sweetalert2';

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
    public ordenesComprasService: OrdenesCompraService
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
  public  cancelarOrden() {
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
              console.log(response.message);
              Swal.fire({
                title: "Cancelada!",
                text: "La orden ha sido cancelada.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.actualizarStatus.emit();
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
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
      confirmButtonText: " SI ",
      denyButtonText: `NO`,
      customClass: {
        confirmButton: "btn btn-success px-4",
        denyButton: "btn btn-danger ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordenesComprasService.enviarSolicitudSurtido(data).subscribe(
          (response) => {
            if (response.status === "success") {
              Swal.fire({
                title: "Enviada!!",
                text: "La orden de compra ha sido autorizada y enviada al proveedor.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.actualizarStatus.emit();
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      } else if (result.isDenied) {
        this.ordenesComprasService.autorizarOrdenCompra(data).subscribe(
          (response) => {
            if (response.status === "success") {
              Swal.fire({
                title: "Orden autorizada!!",
                text: "La orden sera marcada como autorizada",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
              this.actualizarStatus.emit();
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
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
          this.ordenCompra = response;
          this.setOrdenCompra(this.ordenCompra);
          this.isLoad = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }  
}
