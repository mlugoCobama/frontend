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
      // com_vendedores_id: ["", Validators.required],
      folio: ['', Validators.required],
      poliza: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      prima_neta: [null, Validators.required],
      comision_apv_pesos: [{ value: null, disabled: true }],
      observaciones: [null]
    });

    if (this.data) {
      this.setValores(this.data);

    }

    this.form.valueChanges.subscribe(val => {
      if (val.prima_neta) {

        const prima = Number(val.prima_neta.toString().replace(/,/g, ''));

        const comision = prima * 0.20 * 0.20; // o prima * 0.04

        this.form.patchValue(
          { comision_apv_pesos: comision },
          { emitEvent: false }
        );
      }
    });

    

    // this.form.get('numero_factura')?.valueChanges
    //     .pipe(
    //       debounceTime(500),          // espera 500ms después de que el usuario deja de escribir
    //       distinctUntilChanged()      // solo emite si el valor cambió
    //     )
    //     .subscribe(value => {
    //       if (value && value.trim() !== '') {
    //           this.consultarFactura(value);
    //         }
    //     });
      }


  setValores(data: any): void {
  this.form.patchValue({
    id: data.id ?? null,
    // com_vendedores_id: data.com_vendedores_id ?? '',
    folio: data.folio ?? '',
    poliza: data.poliza ?? '',
    fecha_emision: this.formatDateForInputDate(data.fecha_emision) ?? '',
    prima_neta: data.prima_neta ?? null,
    comision_apv_pesos: data.comision_apv_pesos ?? null,
    observaciones: data.observaciones ?? ''
  });
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

public dataVenta:any;
private consultarFactura(noFactura: any) {
  
  this.financiamientoService.getDataVenta(noFactura).subscribe(
    (response: any) => {
      if (response) {
        this.dataVenta = response.data;
        // if ((!this.data || this.data === undefined) && this.dataVenta) {
        //     this.form.patchValue({
        //       com_vendedores_id: this.dataVenta.id_vendedor ?? '',
        //       fecha_desembolso: this.formatDateForInputDate(this.dataVenta.fecha_factura) ?? null
        //     });
        //   }


      } else {
        console.log(response.message);
      }
    },
    (error) => {
      console.error("Error fetching data:", error);
    },
  );
}

}
