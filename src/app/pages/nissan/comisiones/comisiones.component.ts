import { Component, OnInit } from "@angular/core";
import { Comision } from "src/app/core/models/nissan/comisiones";
import { ComisionesService } from "src/app/core/services/nissan/comisiones.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-comisiones",
  templateUrl: "./comisiones.component.html",
  styleUrl: "./comisiones.component.css",
})
export class ComisionesComponent implements OnInit {
  public data: Comision[];
  public vendedores: any;

  public isDisabled = true;

  public ready: boolean = false;
  public isLoadig: boolean = true;
  public showTable: boolean = false;

  public hoy = new Date().toISOString().split("T")[0];

  private fecha_inicio: Date = null;
  private fecha_fin: Date = null;

  public formDatosGastos: FormGroup;

  public porcentajes: any;
  public porcentajesBDC: any;

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
    private comisionesService: ComisionesService,
    private swal: SwalComprsServiceService,
    public formBuilder: FormBuilder
  ) {
    this.formDatosGastos = this.formBuilder.group({});
  }

  public ngOnInit(): void {
    this.getPorcentaje();
    // this.getAll();
  }

  private getPorcentaje() {
    this.comisionesService.getPorentajes().subscribe(
      (response) => {
        if (response.status) {
          this.porcentajes = response.data;
          console.log(this.porcentajes);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public guardarDatos(item) {
    Swal.fire({
      title: "Seguro que quieres guardar estos datos",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isRowValid(item.faau_nofactura)) {
      const data = {
        folio_factura: item.faau_nofactura,
        isNew: item.isNew,
        ...this.recuperarValoresFactura(item.faau_nofactura),
      };
      this.comisionesService.save(data).subscribe((response) => {
        if (response.status === "success") {
          this.swal.mostrarAlerta(
            "Listo",
            response.message,
            "success",
            "success"
          );
          console.log(response);
          this.getAll();
          this.patchValues(item.faau_nofactura, response.data);
        } else {
          this.swal.mostrarAlerta("Error", response.message, "error", "danger");
          this.getAll();
        }
      });
    } else {
      this.swal.mostrarAlerta(
        "Faltan datos",
        "Debes llenar todos los campos",
        "warning",
        "warning"
      );
      // console.log(this.getRowErrors(item.faau_nofactura));
      return;
    }
      } else if (result.isDenied) {
        Swal.fire("Los datos no serán guardados", "", "info");
      }
    });
    
  }

  public patchValues(nofactura: string, data) {
    data = this.data.find((element) => element.faau_nofactura === nofactura);
    console.log(data);
    Object.keys(this.modelInputs).forEach((field) => {
      let controlName = `${field}_${nofactura}`;

      this.formDatosGastos.patchValue({
        [controlName]: data[field],
      });
    });
  }

  /**
   * r
   * @param nofactura 
   * @returns 
   */
public recuperarValoresFactura(nofactura: string): any {
  const values = {};
  Object.keys(this.modelInputs).forEach((field) => {
    const controlName = `${field}_${nofactura}`;
    const control = this.formDatosGastos.get(controlName);
    values[field] = control?.value || "";
  });
  return values;
}

/**
 * Recupera todos los registros de un periodo en especifico
 */
  private getAll() {
    this.showTable = true;
    this.isLoadig = true;
    this.comisionesService.getAll(this.fecha_inicio, this.fecha_fin).subscribe(
      (response) => {
        // console.log(response);
        if (response.status) {
          this.data = response.data;
          // Filtra los datos para solo mostrar ventas que aun no tiene una comisión calculada
          // this.data = response.data.filter((data) => data.isNew === true);
          // Mapea los vendedores para colocarlos dentro del filtro
          this.vendedores = [
            ...new Set(this.data.map((dato) => dato.faau_vend_clave)),
          ];
          this.buildFormGastos();
          // this.comisionesService.emitirEvento();
          // console.log(this.data.length)
          this.isLoadig = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  /**
   * Construye el formulario
   */
  private buildFormGastos() {
    const fields = {};
    this.formDatosGastos = this.formBuilder.group({});
    Object.entries(this.data).forEach((data) => {
      for (const field of Object.keys(this.modelInputs)) {
        // console.log(field)
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
    return porcentajes[tipoVenta as keyof typeof porcentajes] || porcentajes["EXTERNO" as keyof typeof porcentajes];
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
    return porcentajes[tipoVenta as keyof typeof porcentajes] || porcentajes["EXTERNO" as keyof typeof porcentajes];
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

  public idAgencia: any;
  onSelectedAgencia(value) {
    this.idAgencia = value;
    this.validateFilter();
  }

  onSelectVendedor(value) {
    this.idAgencia = value;
    this.validateFilter();
  }

  onSelectInicio(value) {
    this.fecha_inicio = value.length > 0 ? value : null;
    this.validateFilter();
  }

  onSelectFin(value) {
    this.fecha_fin = value.length > 0 ? value : null;
    this.validateFilter();
  }

  /**
   * Valida si el filtro es correcto para mostrar el botón
   * @returns 
   */
  validateFilter() {
    if (
      this.idAgencia > 0 &&
      this.fecha_inicio != null &&
      this.fecha_fin != null
    ) {
      const fecha1 = new Date(this.fecha_inicio);
      const fecha2 = new Date(this.fecha_fin);

      if (fecha1.getTime() > fecha2.getTime()) {
        this.swal.mostrarAlerta(
          "Error",
          "La fecha de incio debe ser anterior a la fecha final",
          "warning",
          "warning"
        );
        this.ready = false;
        return;
      }
      this.ready = true;
    } else {
      this.ready = false;
    }
  }

  /**
   * Verifica si la fila es valida
   * @param nofactura 
   * @returns 
   */
  public isRowValid(nofactura: string): boolean {
    let isValid = true;
    Object.keys(this.modelInputs).forEach((field) => {
      const controlName = `${field}_${nofactura}`;
      const control = this.formDatosGastos.get(controlName);
      if (control && control.invalid) {
        isValid = false;
      }
    });
    return isValid;
  }

  /**
   * Recupera erroes de validacion de la fila 
   * @param nofactura 
   * @returns 
   */
  public getRowErrors(nofactura: string): string[] {
    const errors: string[] = [];
    Object.keys(this.modelInputs).forEach((field) => {
      const controlName = `${field}_${nofactura}`;
      const control = this.formDatosGastos.get(controlName);
      if (control && control.invalid && control.touched) {
        errors.push(`${field} tiene errores`);
      }
    });
    return errors;
  }

}
