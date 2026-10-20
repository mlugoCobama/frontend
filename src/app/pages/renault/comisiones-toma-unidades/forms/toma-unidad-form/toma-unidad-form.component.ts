import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TomaUnidadesService } from 'src/app/core/services/renault/toma-unidades.service';
@Component({
  selector: 'app-toma-unidad-form',
  templateUrl: './toma-unidad-form.component.html',
  styleUrl: './toma-unidad-form.component.css'
})
export class TomaUnidadFormComponent {

  form!: FormGroup;
  loading = false;
  archivo: File | null = null;
  @Input() data: any ;
  @Input() vendedores: any;
  @Input() tipoFinanciamiento: any;
  @Input() agencia: any;

  constructor(private fb: FormBuilder, private tomaUnidadesService: TomaUnidadesService, private financiamientoService: FinanciamientoService) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      id: [null],
      por_inventario: ['', [Validators.maxLength(45), Validators.required]],
      vehiculo: ['', [Validators.required]],
      numero_serie: ['', [Validators.required]],
      tipo_apv: ['', [Validators.required]],
      comision_apv_pesos: [null, [Validators.required, Validators.min(1)]],
      fecha_toma: ['', Validators.required],
      observaciones: [null]
    });



    if (this.data) {
      this.setValores(this.data);

    }

    this.form.valueChanges.subscribe(val => {
      if (val.incentivo_dealer && val.porcentaje_asesor) {
        const comision = (val.incentivo_dealer * val.porcentaje_asesor) / 100;
        this.form.patchValue(
          { comision_asesor_pesos: comision },
          { emitEvent: false }
        );
      }
    });

    

        this.form.get('numero_serie')?.valueChanges
        .pipe(
          debounceTime(500),          // espera 500ms después de que el usuario deja de escribir
          distinctUntilChanged()      // solo emite si el valor cambió
        )
        .subscribe(value => {
          if (value && value.trim() !== '') {
              this.consultarFactura(value);
              
            }
        });
      }


  setValores(data: any): void {
    this.form.patchValue({
        id: data.id ?? null,
        por_inventario: data.por_inventario ?? '',
        vehiculo: data.vehiculo ?? '',
        numero_serie: data.numero_serie ?? '',
        tipo_apv: data.tipo_apv ?? '',
        comision_apv_pesos: data.comision_apv_pesos ?? null,
        fecha_toma: this.formatDateForInputDate(data.fecha_toma) ?? '',
        observaciones: data.observaciones ?? ''
      });

}



  getValores(): any {
    const valores = this.form.getRawValue();

    return {
      ...valores,
      archivo: this.archivo
    };
  }


  esValido(): boolean {
    return this.form.valid;
  }


  limpiar(): void {
    this.form.reset();
    this.archivo = null;
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivo = file;
      this.form.patchValue({ archivo: file.name });
    }
  }

    marcarTodo(): void {
    this.form.markAllAsTouched();
  }

  formatDateForInputDate(isoString:any) {
  const fecha = new Date(isoString);
  const dia = String(fecha.getUTCDate()).padStart(2, '0');
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
}



public dataVenta:any;
private consultarFactura(noFactura: any) {
  this.dataVenta = [];
  this.financiamientoService.getDataVenta(noFactura).subscribe(
    (response: any) => {
      if (response) {
        this.dataVenta = response.data;
        if(this.dataVenta){
          this.form.patchValue({
              vehiculo: this.dataVenta.descripcion,
              por_inventario: `${this.dataVenta.clave_producto}-${this.dataVenta.anio_vehiculo}-${this.dataVenta.no_inventario}`,
            });
        }
        

      } else {
        console.log(response.message);
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    },
  );
}

items: { formData: any; index: number }[] = [];
private itemCounter = 0;


agregarItem(): void {
  this.marcarTodo();
  if (this.form.invalid) return;

  this.items.push({
    formData: this.form.getRawValue(),
    index:    ++this.itemCounter,
  });

  this.limpiar();
}

  quitarItem(index: number): void {
    this.items = this.items.filter(item => item.index !== index);
  }

  getItems(): { formData: any }[] {
  return this.items;
}


}
