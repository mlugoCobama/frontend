
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PrecioProveedor, PreciosPayload, Producto, Proveedor } from './catalogo.models';


@Component({
  selector: 'app-form-precios',
  templateUrl: './form-precios.component.html',
  styleUrl: './form-precios.component.css'
})
export class FormPreciosComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() productos: Producto[] = [];
  @Input() proveedores: Proveedor[] = [];
  @Input() preciosExistentes: PrecioProveedor[] = [];
  @Input() guardando = false;
  @Input() showBtnSave = false;

  @Output() guardar = new EventEmitter<PreciosPayload>();
  @Output() itemSeleccionado = new EventEmitter<any | null>();



  form: FormGroup = this.fb.group({
    productosArray: this.fb.array([]),
  });

  get productosFormArray(): FormArray {
    return this.form.get('productosArray') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productos'] || changes['proveedores'] || changes['preciosExistentes']) {
      this.construirMatriz();
    }
  }

  precioControl(i: number, p: number): FormControl {
    const arr = this.productosFormArray.at(i).get('preciosProveedores') as FormArray;
    return arr.at(p).get('precio') as FormControl;
  }

  esInvalido(i: number, p: number): boolean {
    const c = this.precioControl(i, p);
    return c.invalid && c.touched;
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardar.emit(this.form.getRawValue() as PreciosPayload);
  }

  private construirMatriz(): void {
    const arr = this.productosFormArray;
    arr.clear();


    const indice = new Map<string, number>();
    this.preciosExistentes.forEach((r) =>
      indice.set(`${r.com_productos_id}-${r.com_proveedores_id}`, r.precio),
    );

    this.productos.forEach((prod) => {
      const precios = this.fb.array(
        this.proveedores.map((prov) =>
          this.fb.group({
            proveedor_id: [prov.id, Validators.required],
            precio: [indice.get(`${prod.id}-${prov.id}`) ?? null, [Validators.min(0)]],
          }),
        ),
      );

      arr.push(
        this.fb.group({
          producto_id: [prod.id, Validators.required],
          preciosProveedores: precios,
        }),
      );
    });

    this.form.markAsPristine();
  }

  seleccionar(dato: any, evento: MouseEvent): void {
    const fila = evento.currentTarget as HTMLElement;

    if (fila.classList.contains('table-primary')) {
      fila.classList.remove('table-primary');
      this.itemSeleccionado.emit(null);
    } else {
      document
        .querySelectorAll('tbody tr')
        .forEach((f) => f.classList.remove('table-primary'));
      fila.classList.add('table-primary');
      this.itemSeleccionado.emit(dato);
    }
  }
}

