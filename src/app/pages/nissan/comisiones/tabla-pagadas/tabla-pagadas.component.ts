import { Component, Input } from '@angular/core';
import { Comision } from 'src/app/core/models/nissan/comisiones';

@Component({
  selector: 'app-tabla-pagadas',
  templateUrl: './tabla-pagadas.component.html',
  styleUrl: './tabla-pagadas.component.css'
})
export class TablaPagadasComponent {
  @Input() showTable: boolean;
  @Input() isLoadig: boolean;
  @Input() data:Comision[];
  @Input() porcentajes:any;

   private modelInputs = {
    otros: "",
    gasolina: "",
    previa: "",
    descuentos: "",
    traslados: "",
    descuento_impulso: "",
    total_subsidios: "",
    descuento_gastos: "",
    cortesia: "",
    accesorios: "",
    placas: "",
  };

    /**
   * Busca el porcentaje para cada tipo de venta
   * @param tipoVenta tipo de venta del registro
   * @returns porcentaje del tipo
   */
  public findPorcentaje(tipoVenta: string): number {
    const porcentajes = this.porcentajes.reduce((obj, item) => {
      obj[item.tipo_venta] = parseFloat(item.porcentaje_apv);
      return obj;
    }, {});
    return porcentajes[tipoVenta as keyof typeof porcentajes] || 0;
  }

    /**
   * Busca el porcentaje para cada tipo de venta
   * @param tipoVenta tipo de venta del registro
   * @returns porcentaje del tipo
   */
  public findPorcentajeBDC(tipoVenta: string): number {
    const porcentajes = this.porcentajes.reduce((obj, item) => {
      obj[item.tipo_venta] = parseFloat(item.porcentaje_bdc);
      return obj;
    }, {});
    return porcentajes[tipoVenta as keyof typeof porcentajes] || 0;
  }

    /**
   * Suma los datos del form basado en un form control ('campo_noFactura')
   * @param nofactura numero de factura
   * @returns suma de los gatos
   */
  public calcularTotalGastosFila(item: Comision): number {
    let total = 0;
    total = Number(item.otros) + Number(item.gasolina) + Number(item.previa) + Number(item.descuentos) 
          + Number(item.traslados) +  Number(item.descuento_impulso) + Number(item.total_subsidios) 
          + Number(item.descuento_gastos) +  Number(item.cortesia) + Number(item.accesorios) + Number(item.placas);      
          // console.log(total);
    return total;
  }

    /**
   * Calcula la utilidad final
   * @param item datos de la fila
   * @returns utilidad final despues de gastos
   */
  public calcularUtilidadFinal(item: Comision): number {
    const utilidad = +item.Utilidad;
    const totalGastos = this.calcularTotalGastosFila(item);

    return utilidad - totalGastos;
  }

  /**
   * Calcula la comision de los apv
   * @param item datos de la fila
   * @returns comision para el apv
   */
  public calcularComisionApv(item: Comision): number {
    const utilidadFinal = this.calcularUtilidadFinal(item);
    // const utilidadDespuesDescuento = utilidad - (utilidad * 0.225);
    const porcentaje = this.findPorcentaje(item.faau_form_TipoVenta);
    const porcentajeBDC = this.findPorcentajeBDC(item.faau_form_TipoVenta);

    // console.log("calculo", utilidadFinal, porcentaje, porcentajeBDC);

    return utilidadFinal * (porcentaje - porcentajeBDC);
  }
}
