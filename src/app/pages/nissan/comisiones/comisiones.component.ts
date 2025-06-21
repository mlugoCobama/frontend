import { Component, OnInit } from '@angular/core';
import { Comision } from 'src/app/core/models/nissan/comisiones';
import { ComisionesService } from 'src/app/core/services/nissan/comisiones.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrl: './comisiones.component.css'
})
export class ComisionesComponent implements OnInit{

  public data: Comision[];

  public formDatosGastos: FormGroup;

  private modelInputs = {
    otros: "",
    gasolina: "",
    previa: "",
    descuentos: "",
    traslados: "",
    total_subsidios: "",
    descuento_gastos: "",
    cortesia: "",
    accesorios: "",
    placas: "",
  };

  constructor(
      private comisionesService: ComisionesService,
      public formBuilder: FormBuilder,
    ){
      this.formDatosGastos = this.formBuilder.group({});
    }
  
    public ngOnInit(): void {
      
      this.getAll();
      
    }
  
    private getAll() {
  
      this.comisionesService.getAll()
                        .subscribe(
                          response => {
                            console.log(response);
                            
                              if (response.status) {
                                this.data = response.data;

                                this.buildFormGastos();
                                
                              } else {
                                console.log(response.message);
  
                              }
                          },
                          error => {
                              console.error('Error fetching data:', error);
                          }
                        );
    }



    private buildFormGastos() {
    const formControls = {};
    
    // Crear el form control para cada elemento de datos y cada campo de entrada
    this.data.forEach((item) => {
      Object.keys(this.modelInputs).forEach((field) => {
        const controlName = `${field}_${item.faau_nofactura}`;
        formControls[controlName] = this.formBuilder.control('', [Validators.min(0)]);
      });
    });

    this.formDatosGastos = this.formBuilder.group(formControls);
     console.log(this.formDatosGastos);
  }

  public findPorcentaje(tipoVenta: string): number {
    const porcentajes = {
      'FLOTILLA': 0.15,
      'EXTERNO': 0.20,
      'CREDINISSA': 0.18,
      'SICREA': 0.18,
      'CONTADO': 0.16
    };
    
    return porcentajes[tipoVenta as keyof typeof porcentajes] || 0;
  }

  public findPorcentajeBDC(tipoVenta: string): number {
    const porcentajes = {
      'FLOTILLA': 0,
      'EXTERNO': 0,
      'CREDINISSA': 0,
      'SICREA': 0,
      'CONTADO': 0
    };
    
    return porcentajes[tipoVenta as keyof typeof porcentajes] || 0;
  }

  // Calcula los gastos de la fila basado en una factura especifica
  public calcularTotalGastosFila(nofactura: string): number {
    let total = 0;
    
    Object.keys(this.modelInputs).forEach(field => {
      const controlName = `${field}_${nofactura}`;
      const value = this.formDatosGastos.get(controlName)?.value;
      if (value && !isNaN(parseFloat(value))) {
        total += parseFloat(value.toString().replace(/,/g, ''));
      }
    });
    
    return total;
  }

  // Calcula la utilidad final
  public calcularUtilidadFinal(item: Comision): number {
    const utilidad = +item.Utilidad;
    // const descuentoFijo = utilidad * 0.225; // Fixed 22.5% discount
    // const comisionApv = this.calcularComisionApv(item);
    const totalGastos = this.calcularTotalGastosFila(item.faau_nofactura);
    
    return utilidad - totalGastos;
  }

  // Calcula la comision de los apv
  public calcularComisionApv(item: Comision): number {
    const utilidadFinal = this.calcularUtilidadFinal(item)
    // const utilidadDespuesDescuento = utilidad - (utilidad * 0.225);
    const porcentaje = this.findPorcentaje(item.faau_form_TipoVenta);
    const porcentajeBDC = this.findPorcentajeBDC(item.faau_form_TipoVenta);
    
    return utilidadFinal * (porcentaje - porcentajeBDC);
  }

  // Recupera los valores de una factura en especifico
  public getFormValuesPorFactura(nofactura: string): any {
    const values = {};
    Object.keys(this.modelInputs).forEach(field => {
      const controlName = `${field}_${nofactura}`;
      const control = this.formDatosGastos.get(controlName);
      values[field] = control?.value || '';
    });
    return values;
  }

  // Metodo para el boton guardar
  public saveFormData() {
    if (this.formDatosGastos.valid) {
      const allData = this.data.map(item => ({
        // ...item,
        gastos: this.getFormValuesPorFactura(item.faau_nofactura),
        // totalGastos: this.calcularTotalGastosFila(item.faau_nofactura),
        // utilidadFinal: this.calcularUtilidadFinal(item),
        // comisionApv: this.calcularComisionApv(item)
      }));
      
      console.log('Datos para guardar:', allData);
      
      // Aquí va ir mi servicio para cuando sepa que se va a guardar 

    } else {
      console.log('Formulario no valido');
    }
  }



  // Formatea los números para mostrarlos en pantalla
  public formatNumber(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Recupera el valor del input por su controll name
  public getControlValue(controlName: string): string {
    const control = this.formDatosGastos.get(controlName);
    return control ? control.value || '' : '';
  }


}
