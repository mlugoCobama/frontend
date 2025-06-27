import { Component, Input, OnInit } from '@angular/core';
import { Comision } from "src/app/core/models/nissan/comisiones";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';

@Component({
  selector: 'app-tabla-captura',
  templateUrl: './tabla-captura.component.html',
  styleUrl: './tabla-captura.component.css'
})
export class TablaCapturaComponent implements OnInit {
  @Input() showTable: boolean;
  @Input() isLoadig: boolean;
  @Input() data:Comision[];
  @Input() porcentajes:any;

  public formDatosGastos: FormGroup;

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

  constructor(
    private swal: SwalComprsServiceService,
    private comisiones: ComisionesService,
    public formBuilder: FormBuilder
    // private comisionesService:  ComisionesService
  ){
    this.formDatosGastos = this.formBuilder.group({});
     this.comisiones.$emitter.subscribe(() => {
    //   const datos = this.data.filter((data) => data.isNew === true);
    //  console.log( datos,'se ejecuto esto')
    this.buildFormGastos()
  });
  }

  ngOnInit(): void {

   this.buildFormGastos();
  }

  private filtrarDatos(){

  }
  /**
   * Construye el formulario
   */
  private buildFormGastos() {
    const fields = {};
    this.formDatosGastos = this.formBuilder.group({});
    Object.entries(this.data).forEach((data) => {
      for (const field of Object.keys(this.modelInputs)) {
        const controlName = `${field}_${data[1].faau_nofactura}`;
        this.formDatosGastos.addControl(
          controlName,
          this.formBuilder.control(data[1][field], Validators.required)
        );
      }
    });
  }
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
    public calcularTotalGastosFila(nofactura: string): number {
      let total = 0;

      Object.keys(this.modelInputs).forEach((field) => {
        const controlName = `${field}_${nofactura}`;
        const value = this.formDatosGastos.get(controlName)?.value;
        if (value && !isNaN(parseFloat(value))) {
          total += parseFloat(value.toString().replace(/,/g, ""));
        }
      });

      return total;
    }

    /**
     * Calcula la utilidad final
     * @param item datos de la fila
     * @returns utilidad final despues de gastos
     */
    public calcularUtilidadFinal(item: Comision): number {
      const utilidad = +item.Utilidad;
      const totalGastos = this.calcularTotalGastosFila(item.faau_nofactura);

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
