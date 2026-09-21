import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-operacion-form',
  templateUrl: './datos-operacion-form.component.html',
  styleUrl: './datos-operacion-form.component.css'
})
export class DatosOperacionFormComponent {
ventaForm!: FormGroup;

  // Catálogos estáticos de ejemplo
  tiposVenta: string[] = ['Contado', 'Crédito', 'Arrendamiento', 'Financiamiento'];
  canalesVenta: string[] = ['Piso de Venta', 'En Línea', 'Fuerza de Ventas (Cambaceo)', 'Licitación'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.ventaForm = this.fb.group({
      tipoVenta: ['', Validators.required],
      vehiculo: ['', Validators.required],
      modeloAnio: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      fechaInicioOperacion: ['', Validators.required],
      canalVenta: ['', Validators.required],
      tipo: ['', Validators.required],
      catalogo: ['', Validators.required],
      vin: ['', [Validators.required, Validators.minLength(17), Validators.maxLength(17)]],
      montoVehiculo: [0, [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      accesorios: this.fb.array([]), // FormArray para las partidas
      montoTotal: [{ value: 0, disabled: true }] // Campo de solo lectura calculado
    });

    // Recalcular el total si cambia el valor del vehículo
    this.ventaForm.get('montoVehiculo')?.valueChanges.subscribe(() => {
      this.calcularMontoTotal();
    });
  }

  // Getter útil para iterar sobre las partidas en el HTML
  get accesorios(): FormArray {
    return this.ventaForm.get('accesorios') as FormArray;
  }

  // Método para crear un nuevo FormGroup dentro del FormArray
  crearPartidaAccesorio(): FormGroup {
    return this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]],
      subtotal: [{ value: 0, disabled: true }]
    });
  }

  agregarAccesorio(): void {
    const accesorioGroup = this.crearPartidaAccesorio();

    // Escuchar cambios en la partida para recalcular subtotal y total general
    accesorioGroup.valueChanges.subscribe(() => {
      this.actualizarSubtotalAccesorio(accesorioGroup);
      this.calcularMontoTotal();
    });

    this.accesorios.push(accesorioGroup);
    this.calcularMontoTotal();
  }

  eliminarAccesorio(index: number): void {
    this.accesorios.removeAt(index);
    this.calcularMontoTotal();
  }

  private actualizarSubtotalAccesorio(group: FormGroup): void {
    const cantidad = group.get('cantidad')?.value || 0;
    const precioUnitario = group.get('precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;

    group.get('subtotal')?.setValue(subtotal, { emitEvent: false });
  }

  calcularMontoTotal(): void {
    const montoBaseVehiculo = Number(this.ventaForm.get('montoVehiculo')?.value) || 0;

    const totalAccesorios = this.accesorios.controls.reduce((acc, control) => {
      const cantidad = Number(control.get('cantidad')?.value) || 0;
      const precioUnitario = Number(control.get('precioUnitario')?.value) || 0;
      return acc + (cantidad * precioUnitario);
    }, 0);

    const totalGeneral = montoBaseVehiculo + totalAccesorios;
    this.ventaForm.get('montoTotal')?.setValue(totalGeneral, { emitEvent: false });
  }

  guardar(): void {
    if (this.ventaForm.valid) {
      // getRawValue() incluye campos deshabilitados como 'montoTotal'
      const payload = this.ventaForm.getRawValue();
      console.log('Datos listos para enviar:', payload);
    } else {
      this.ventaForm.markAllAsTouched();
    }
  }
}
