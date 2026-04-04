import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "app-accesorio-form",
  templateUrl: "./accesorio-form.component.html",
  styleUrl: "./accesorio-form.component.css",
})
export class AccesorioFormComponent implements OnInit {
  @Input() data: any;
  @Input() vendedores: any;
  form!: FormGroup;
  loading = false;
  archivo: File | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // com_vendedores_id: ["", Validators.required],
      no_factura: [null, Validators.required],
      no_pedido: [null, Validators.required],
      razon_social: [null, Validators.required],
      subtotal_factura: [null, Validators.required],
      fecha: [null, Validators.required],
      iva_factura: [{ value: null, disabled: true }, Validators.required],
      total: [{ value: null, disabled: true }, Validators.required],
      comision_apv_pesos: [
        { value: null, disabled: true },
        Validators.required,
      ],
      observaciones: [null],
    });

    // Cálculo automático de comisión
    this.form.get("subtotal_factura")
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((subtotal) => {
        if (subtotal && !isNaN(subtotal)) {
          const iva = subtotal * 0.16;
          const comision = subtotal * 0.1;
          const total = +subtotal + iva;
          this.form.patchValue(
            {
              comision_apv_pesos: comision.toFixed(2),
              iva_factura: iva.toFixed(2),
              total: total.toFixed(2)
            },
            { emitEvent: false },);
        } else {
          this.form.patchValue(
            { comision_apv_pesos: null, iva_factura: null, total: null},
            { emitEvent: false },);
        }
      });
    if (this.data) {
      this.setValores(this.data);
    }
  }

  setValores(data: any): void {
    this.form.patchValue({
      com_vendedores_id: data.com_vendedores_id ?? null,
      razon_social: data.razon_social ?? "",
      fecha: this.formatDateForInputDate(data.fecha_factura) ?? null,
      no_factura: data.no_factura ?? null,
      no_pedido: data.no_pedido ?? null,
      subtotal_factura: data.sub_total_factura ?? null,
      comision_apv_pesos: data.comision_apv_pesos ?? null,
      observaciones: data.observaciones ?? "",
    });
  }

  getValores(): any {
    const valores = this.form.getRawValue();

    return valores
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
}
