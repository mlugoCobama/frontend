import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-financiamiento-form',
  templateUrl: './financiamiento-form.component.html',
  styleUrl: './financiamiento-form.component.css'
})
export class FinanciamientoFormComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  archivo: File | null = null;
  @Input() data: any ;
  @Input() vendedores: any;
  @Input() tipoFinanciamiento: any;
  @Output() vendedorAgencia = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private financiamientoService:FinanciamientoService ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      id: [null],
      no_contrato: ['', [Validators.maxLength(45),Validators.required]],
      fecha_desembolso: ['',Validators.required],
      numero_factura: ['', [Validators.maxLength(45),Validators.required],],
      monto_financiar: [null,Validators.required],
      incentivo_dealer: [null,Validators.required],
      porcentaje_asesor: [70 ,Validators.required],
      comision_asesor_pesos: [{ value: null, disabled: true }],
      razon_social: [''],
      descripcion: [''],
      serie: [''],
      tipo_financiamiento: [this.tipoFinanciamiento ?? ''],
      archivo: [null, Validators.required],
      observaciones: [null],
      fecha_factura: [null],
      kit_seguridad: [0],
      sat_finder: [0],
      garantia_extendida: [0],
      seguro_vf3: [0],
      accesorios_adicionales: [0],

      comision_mantenimiento: [0],
      comision_garantia_extendida: [0],
      comision_udi: [0],
      comision_vf3: [0],
      sub_x_des: [0]
    });

    if (this.data) {
      this.setValores(this.data);

    }

    this.form.valueChanges.subscribe(val => {
      if (val.incentivo_dealer && val.porcentaje_asesor) {
        const comision = (val.incentivo_dealer * val.porcentaje_asesor) / 100;
        this.form.patchValue(
          { comision_asesor_pesos: comision.toFixed(2) },
          { emitEvent: false }
        );
      }
    });

    

    this.form.get('numero_factura')?.valueChanges
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
      id: data.id ??  null,
      no_contrato:           data.no_contrato           ?? '',
      fecha_desembolso:      this.formatDateForInputDate(data.fecha_desembolso) ?? '',
      numero_factura:        data.numero_factura        ?? '',
      fecha_factura:          data.fecha_factura        ?? '',
      monto_financiar:       data.monto_financiar       ?? null,
      incentivo_dealer:      data.incentivo_dealer      ?? null,
      porcentaje_asesor:     data.porcentaje_asesor ?  (Number(data.porcentaje_asesor) * 100) : null,
      comision_asesor_pesos: data.comision_asesor_pesos ?? null,
      com_vendedores_id:     data.com_vendedores_id     ?? null,
      tipo_financiamiento:   data.tipo_financiamiento   ?? this.tipoFinanciamiento ?? '',
      observaciones:         data.observaciones   ??  '',

      kit_seguridad: data.kit_seguridad   ??  0,
      sat_finder: data.sat_finder   ??  0,
      garantia_extendida: data.garantia_extendida   ??  0,
      seguro_vf3: data.seguro_vf3   ??  0,
      accesorios_adicionales: data.accesorios_adicionales   ??  0,

      comision_mantenimiento: data.comision_mantenimiento   ??  0,
      comision_garantia_extendida: data.comision_garantia_extendida   ??  0,
      comision_udi: data.comision_udi   ??  0,
      comision_vf3: data.comision_vf3   ??  0,
      sub_x_des: data.sub_x_des   ??  0
    });

     if (data.id) {
      this.form.get('archivo')?.clearValidators();
    } else {
      this.form.get('archivo')?.setValidators([Validators.required]);
    }
    
    this.form.get('archivo')?.updateValueAndValidity();

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
      // this.form.patchValue({ archivo: file.name });
      this.archivo = file;  
    }
  }

    marcarTodo(): void {
    this.form.markAllAsTouched();
  }

  formatDateForInputDate(isoString: string): string {
  const fecha = new Date(isoString);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // meses van de 0-11
  const anio = fecha.getFullYear();

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
          console.log(this.dataVenta)
          this.form.patchValue({
              razon_social: this.dataVenta.razon_social,
              descripcion: `${this.dataVenta.descripcion} ${this.dataVenta.anio_vehiculo}`,
              serie: this.dataVenta.serie,
              fecha_factura: this.formatDateForInputDate(this.dataVenta.fecha_factura),
            });
            this.vendedorAgencia.emit(
              {
                agencia: this.dataVenta.agencia,
                com_vendedores_id: this.dataVenta.id_vendedor
              }
            );
          
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

items: { formData: any; archivo: File; index: number }[] = [];
private itemCounter = 0;


  agregarItem(): void {
    this.marcarTodo();
    if (this.form.invalid) return;

    this.items.push({
      formData: this.form.getRawValue(),
      archivo:  this.archivo!,
      index:    ++this.itemCounter,
    });

    this.limpiar();

    this.form.get('archivo')?.setValidators([Validators.required]);
    this.form.get('archivo')?.updateValueAndValidity();
}

  quitarItem(index: number): void {
    this.items = this.items.filter(item => item.index !== index);
  }

  getPayload(): { financiamientos: any[]; archivos: File[] } {
    return {
      financiamientos: this.items.map(i => i.formData),
      archivos:        this.items.map(i => i.archivo),
    };
  }

  getItems(): { formData: any; archivo: File }[] {
  return this.items;
}
}