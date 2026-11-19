
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PrecioProveedor, PreciosPayload, Producto, Proveedor } from './catalogo.models';
import { CatProductosService } from 'src/app/core/services/compras/cat-productos.service';


@Component({
  selector: 'app-form-precios',
  templateUrl: './form-precios.component.html',
  styleUrl: './form-precios.component.css'
})
export class FormPreciosComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private catProductosService = inject(CatProductosService);

  @Input() productos: Producto[] = [];
  @Input() proveedores: Proveedor[] = [];
  @Input() catPreciosFile: any[] = [];
  @Input() preciosExistentes: PrecioProveedor[] = [];
  @Input() guardando = false;
  @Input() showBtnSave = false;

  @Output() guardar = new EventEmitter<any>();
  @Output() itemSeleccionado = new EventEmitter<any | null>();

  archivosProveedores: { [proveedorId: number]: File } = {};

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
    this.guardar.emit({
      formValues: this.form.getRawValue(),
      archivosProveedores: this.archivosProveedores
    });
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
          archivo: [null]
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

  onFileProveedorSelected(event: any, proveedorId: number): void {
    const file: File = event.target.files[0];
    if (file) {
      this.archivosProveedores[proveedorId] = file;
    } else {
      delete this.archivosProveedores[proveedorId];
    }
  }

  /**
   * abre los archivos en una pestaña nueva
   * @param ruta ruta del archivo
   */
  verArchivos(ruta: any) {
    if (!ruta) return;
    this.catProductosService.abrirArchivo(ruta);
  }

  findFileProve(idProv:any){
    const resultado = this.catPreciosFile.find((cpf: any) => cpf.id === idProv)?.catalogo_precios;
    return resultado;
  }
}

