import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-detalle-accesorio-form",
  templateUrl: "./detalle-accesorio-form.component.html",
  styleUrl: "./detalle-accesorio-form.component.css",
})
export class DetalleAccesorioFormComponent implements OnInit {
  form!: FormGroup;
  @Input() detalles: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(1)]],
      concepto: ["", Validators.required],
      importe: [null, [Validators.required, Validators.min(0)]],
    });
  }

  agregarDetalle(): void {
    if (this.form.valid) {
      this.detalles.push(this.form.value);
      this.form.reset(); 
    } else {
      this.form.markAllAsTouched();
    }
  }

  removerDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }

  calcularTotal(): number {
    return this.detalles.reduce((acc, d) => acc + d.cantidad * d.importe, 0);
  }

  getValores(): any {
    return this.detalles;
  }

  setValores(data: any): void {
    this.detalles = data;
  }
}
