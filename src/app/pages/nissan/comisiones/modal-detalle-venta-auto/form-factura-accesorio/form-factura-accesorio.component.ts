import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccesoriosService } from 'src/app/core/services/renault/accesorios.service';

@Component({
  selector: 'app-form-factura-accesorio',
  templateUrl: './form-factura-accesorio.component.html',
  styleUrl: './form-factura-accesorio.component.css'
})
export class FormFacturaAccesorioComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  dataFactura: any = null;

  @Output() addFactura =  new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private accesoriosService: AccesoriosService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      no_factura: ['', Validators.required],
      descripcion: [{ value: '', disabled: true }],
      razon_social: [{ value: '', disabled: true }],
      monto: [{ value: null, disabled: true }],
      observaciones: [null]
    });
  }

  asignarFactura(): void {
    const noFactura = this.form.get('no_factura')?.value;

    if (!noFactura || noFactura.trim() === '') {
      this.form.get('no_factura')?.markAsTouched();
      return;
    }

    this.loading = true;
    this.dataFactura = null;

    this.accesoriosService.getFacturaAccesorios(noFactura).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status == 'success' && response.data) {
          this.dataFactura = response.data;
          this.addFactura.emit(response.data);
          this.form.reset();
        } else {
          this.loading = false;
          console.log(response?.message || 'No se encontró información para la factura.');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al consultar la factura:', error);
      }
    });
  }

  setValores(data: any): void {
    this.form.patchValue({
      id: data.id ?? null,
      no_factura: data.no_factura ?? '',
      descripcion: data.descripcion ?? '',
      razon_social: data.razon_social ?? '',
      monto: data.monto ?? null,
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
    this.dataFactura = null;
  }

  marcarTodo(): void {
    this.form.markAllAsTouched();
  }
}
