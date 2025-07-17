import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-precios-detalles',
  templateUrl: './tabla-precios-detalles.component.html',
  styleUrl: './tabla-precios-detalles.component.css'
})
export class TablaPreciosDetallesComponent implements OnInit {

  @Input() cotProv:any;
  @Input() isLoad:any;
  @Input() detalles:any;
  public totals:any;
  public totalMasBajo:any;


  ngOnInit(): void {
    this.addProveedorColumns();
  }
  /**
   * Agrega columnas e inputs
   */
  private addProveedorColumns() {
    this.cotProv.forEach((cotizacion) => {
      const proveedorId = cotizacion.proveedores_id[0].id;

      this.detalles.forEach((detalle) => {
        const detalleCotizacion = cotizacion.detalles.find(
          (d) => d.detalle_solicitud_id === detalle.id
        );

        detalle["precio_" + proveedorId] = detalleCotizacion
          ? detalleCotizacion.importe_unitario
          : "";

        detalle["disabled_" + proveedorId] = !!detalleCotizacion;
      });
      this.updateTotals();
    });
  }

  /**
   * Actualiza los valores de totales
   */
  public updateTotals() {
    this.totals = {};
    this.cotProv.forEach((cotizacion) => {
      let total = 0;
      const proveedorId = cotizacion.proveedores_id[0].id;
      this.detalles.forEach((detalle) => {
        const precio = parseFloat(detalle["precio_" + proveedorId]);
        if (!isNaN(precio)) {
          total += precio * detalle.cantidad;
        }
      });

      this.totals["precio_" + proveedorId] = total;
    });
    this.totalMasBajo = this.getTotalMasBajo();
  }

  /**
   *Recupera el total mas bajo
   */
  getTotalMasBajo(): number {
    let tmasBajo = Number.MAX_VALUE;
    for (let prov of this.cotProv) {
      let total = this.totals["precio_" + prov.proveedores_id[0].id];
      if (total < tmasBajo) {
        tmasBajo = total;
      }
    }
    if (tmasBajo != 0) {
      return tmasBajo;
    }
  }
}
