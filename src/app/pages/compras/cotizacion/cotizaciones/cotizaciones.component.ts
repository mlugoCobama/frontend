import { Component, Input, OnInit, NgModule } from "@angular/core";

import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CotizacionesService } from "src/app/core/services/compras/cotizaciones/cotizaciones.service";

import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: "app-cotizaciones",
  templateUrl: "./cotizaciones.component.html",
  styleUrls: ["./cotizaciones.component.css"],
})
export class CotizacionesComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    public cotizacionesService : CotizacionesService,
    public comprasService: ComprasService
  ) {}

  public ngOnInit(): void {
    this.getDetalle();
    



  }
  public modalRef?: BsModalRef;
 @Input() solicitudCompra: any;

  // public solicitudCompra: any;
  public cotProv: any[] = [];
  public detalles: any[] = [];
  public isLoad = true;
  public totals: any = {};
  public selectedImage = {};
  public mostrarTotal: boolean = false;
  

  private getDetalle(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.comprasService.getOne(this.solicitudCompra.id).subscribe(
        (response) => {
          if (response) {
            this.detalles = response.data;
            this.isLoad = false;

            if (this.solicitudCompra.estatus === 2) {
              this.getProveedoresCotizacion();
              this.addProveedorColumns();
              this.mostrarTotal= true;
            }
            this.updateTotals(); 

            
            resolve(this.detalles);
          } else {
            console.log(response.message);
            reject(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
          reject(error);
        }
      );
    });
  }

  private addProveedorColumns() {
    this.cotProv.forEach((proveedor) => {
      this.detalles.forEach((detalle) => {
        detalle["precio_" + proveedor.proveedores_id.id] = "";
      });
    });
  }

  public getProveedoresCotizacion() {
    this.cotizacionesService.getOne(this.solicitudCompra.id).subscribe(
      (response) => {
        if (response) {
          this.cotProv = response.data;
          this.isLoad = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public updateTotals() {
    this.totals = {};
    this.cotProv.forEach((proveedor) => {
      let total = 0;
      this.detalles.forEach((detalle) => {
        const precio = parseFloat(
          detalle["precio_" + proveedor.proveedores_id.id]
        );
        if (!isNaN(precio)) {
          total += precio * detalle.cantidad;
        }
      });
      this.totals["precio_" + proveedor.proveedores_id.id] = total;
    });
  }

  public openModal(content: any, imgReferencia: string) {
    this.selectedImage = imgReferencia;
    this.modalRef = this.modalService.show(content, { class: "modal-sm" });
  }
}
