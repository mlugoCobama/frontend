import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlmacenProductosService } from 'src/app/core/services/compras/almacen-productos.service';

@Component({
  selector: 'app-modal-movimientos-almacen',
  templateUrl: './modal-movimientos-almacen.component.html',
  styleUrl: './modal-movimientos-almacen.component.css'
})
export class ModalMovimientosAlmacenComponent implements OnInit {

public productoId: any = null;
public almacenEmpresa: any = null;
public movimientos = [];
  constructor(
      public modalRef: BsModalRef,
      private almacenProductos : AlmacenProductosService,
    ) {}

    ngOnInit(): void {
      this.getMovimientos();
    }


    public getMovimientos() {
    this.movimientos = [];
    this.almacenProductos.getMovimientosProducto(this.productoId, this.almacenEmpresa).subscribe(
      (response) => {
        if (response) {
        console.log(response)
          this.movimientos = response.data;
          console.log(this.movimientos);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      },
    );
  }

   /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }
}
