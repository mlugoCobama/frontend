import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanciamientoService } from 'src/app/core/services/renault/financiamiento.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-seguro-form',
  templateUrl: './seguro-form.component.html',
  styleUrl: './seguro-form.component.css'
})
export class SeguroFormComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  archivo: File | null = null;
  @Input() data: any ;
  @Input() vendedores: any;
  @Input() tipoFinanciamiento: any;

  constructor(private fb: FormBuilder, private financiamientoService:FinanciamientoService ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
        id: [null],

        // básicos
        folio: ['', Validators.required],
        poliza: ['', Validators.required],
        aseguradora: ['', Validators.required],
        nombre: ['', Validators.required],
        unidad: ['', Validators.required],
        serie: ['', Validators.required],

        // fechas
        fecha_emision: ['', Validators.required],

        // info adicional
        forma_pago: ['', Validators.required],

        // montos
        prima_neta: [null, Validators.required],
        vs: [{ value: null, disabled: true }],
        calcular_encargado_seg: [true],
        com_encargado_seg: [{ value: null, disabled: true }],

        // comisión
        comision_apv_pesos: [{ value: null, disabled: true }],

        // extras
        observaciones: [null]
    });

    if (this.data) {
      this.setValores(this.data);
    }

    this.form.get('prima_neta')?.valueChanges.subscribe(() => {
      this.calcularValores();
    });

    this.form.get('calcular_encargado_seg')?.valueChanges.subscribe(() => {
      this.calcularValores();
    });


    

  this.form.get('serie')?.valueChanges
      .pipe(
        debounceTime(500),          
        distinctUntilChanged()      
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
    folio: data.folio ?? '',
    poliza: data.poliza ?? '',
    fecha_emision: this.formatDateForInputDate(data.fecha_emision) ?? '',
    prima_neta: data.prima_neta ?? null,
    observaciones: data.observaciones ?? '',
    aseguradora: data.aseguradora ?? '',
    nombre: data.nombre ?? '',
    unidad: data.unidad ?? '',
    serie: data.serie ?? '',
    forma_pago: data.forma_pago ?? '',
    calcular_encargado_seg: (data.com_encargado_seg ?? 0) > 0 ? true : false,
  });
}

private limpiarNumero(valor: any): number {
  if (!valor) return 0;
  return Number(valor.toString().replace(/[^0-9.-]+/g, ''));
}

  getValores(): any {
  return this.form.getRawValue();
}

  esValido(): boolean {
    return this.form.valid;
  }


  limpiar(): void {
  this.form.reset();
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

  formatDateForInputDate(isoString: string): string {
  const fecha = new Date(isoString);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // meses van de 0-11
  const anio = fecha.getFullYear();

  return `${anio}-${mes}-${dia}`;
}

private calcularValores(): void {
  const prima = this.limpiarNumero(this.form.get('prima_neta')?.value);
  const calcularEnc = this.form.get('calcular_encargado_seg')?.value;

  if (!prima || prima <= 0) {
    this.form.patchValue({
      comision_apv_pesos: null,
      vs: null,
      com_encargado_seg: null
    }, { emitEvent: false });
    return;
  }

  const comision = prima * 0.04;
  const vs = prima * 0.20;
  const encSeg = calcularEnc ? vs * 0.05 : 0;

  this.form.patchValue({
    comision_apv_pesos: comision.toFixed(2),
    vs: vs.toFixed(2),
    com_encargado_seg: encSeg.toFixed(2)
  }, { emitEvent: false });
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
              unidad: this.dataVenta.descripcion,
              nombre: this.dataVenta.razon_social,
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
