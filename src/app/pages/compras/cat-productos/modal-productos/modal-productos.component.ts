import { Component, EventEmitter, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { finalize } from 'rxjs';
import { CatProductosService } from 'src/app/core/services/compras/cat-productos.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';


@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrl: './modal-productos.component.css'
})
export class ModalProductosComponent {
  public event: EventEmitter<any> = new EventEmitter();

  itemForm!: FormGroup;
  mainForm!: FormGroup;

  catCategorias: any = [];
  subCategorias: any = [];
  unidadesMedida: any = [];

  public sending:boolean = false;

  public producto: any;
  public tipo: string = 'agrega';
  public categoria: any;

  public modalRef =  inject(BsModalRef);
  private fb =  inject(FormBuilder);

  private catProductosService = inject(CatProductosService);
  private alertasService =  inject(SwalComprsServiceService);



  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

  ngOnInit(): void {
    this.initForms();
    this.configurarListeners();

    if(this.tipo == 'actualiza'){
      this.setValores()
    }

  }

  private initForms(): void {
    this.itemForm = this.fb.group({
      id: [null],
      categoria: [null, Validators.required],
      subcategoria: [null, Validators.required],
      clave_interna: ['', Validators.required],
      cant_default: [1, [Validators.required, Validators.min(1)]],
      cat_unidad_medida: [null, Validators.required],
      descripcion_planta: [''],
      descripcion: [''],
      observaciones: ['']
    });

    this.mainForm = this.fb.group({
      items: this.fb.array([])
    });


  }

  get itemsFormArray(): FormArray {
    return this.mainForm.get('items') as FormArray;
  }

  private configurarListeners(): void {
    this.itemForm.get('categoria')?.valueChanges.subscribe(sistemaSeleccionado => {
      if (sistemaSeleccionado) {
        this.subCategorias = sistemaSeleccionado.sub_categorias || [];
      } else {
        this.subCategorias = [];
      }

      this.itemForm.get('subcategoria')?.setValue(null);
    });
  }

  agregarItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const val = this.itemForm.value;

    const newItemRow = this.fb.group({
      id: val.id,
      categoria: [val.categoria.sistema, Validators.required],
      subcategoria: [val.subcategoria.nombre, Validators.required],
      subcategoria_id: [val.subcategoria.id, Validators.required],
      clave_interna: [val.clave_interna, Validators.required],
      cant_default: [+val.cant_default, Validators.required],
      cat_unidad_medida_id: [val.cat_unidad_medida.id, Validators.required],
      cat_unidad_medida: [val.cat_unidad_medida.nombre, Validators.required],
      descripcion_planta: [val.descripcion_planta],
      descripcion: [val.descripcion],
      observaciones: [val.observaciones]
    });

    this.itemsFormArray.push(newItemRow);

    this.itemForm.patchValue({
      id: null,
      clave_interna: '',
      cant_default: 1,
      cat_unidad_medida: null,
      cat_unidad_medida_id: null,
      descripcion_planta: '',
      descripcion: '',
      observaciones: ''
    })
  }

  removerItem(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  public saving: boolean = false;
  guardar(): void {
    if (this.mainForm.invalid || this.itemsFormArray.length === 0) return;

    this.saving = true;
    const payload = this.mainForm.value;

    this.catProductosService
      .saveCatalogoProductos(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if(res.status == 'success'){
            this.alertasService.mostrarAlerta('Listo', res.message || 'Guardado correctamente', 'success', 'success');
            this.event.emit();
            this.cerrarModal();
          }

        },
        error: (err) => {
          const mensajeError = err.error?.message || err.message || 'Ocurrió un error';
          this.alertasService.mostrarAlerta('Error!', mensajeError, 'error', 'danger');
        },
      });
  }

  private setValores() {
    if (!this.producto) return;
    const categoriaEncontrada = this.catCategorias.find(
      (cat: any) => cat.id === this.categoria.id
    );

    if (categoriaEncontrada) {
      this.itemForm.get('categoria')?.setValue(categoriaEncontrada);
      setTimeout(() => {
        const subcategoriaEncontrada = this.subCategorias.find(
          (sub: any) => sub.id === this.producto?.com_subcategoria_id
        );

        const unidadEncontrada = this.unidadesMedida.find(
          (uni: any) => uni.id == this.producto?.com_cat_unidad_medida_id
        );

        this.itemForm.patchValue({
          id: this.producto?.id || null,
          subcategoria: subcategoriaEncontrada || null,
          clave_interna: this.producto?.clave_interna || '',
          cant_default: this.producto?.cant_default || 1,
          cat_unidad_medida: unidadEncontrada || null,
          descripcion_planta: this.producto?.descripcion_planta || '',
          descripcion: this.producto?.descripcion_proveedor || '',
          observaciones: this.producto?.observaciones || ''
        });
      }, 200);
    }
  }

  actualizar(): void {

    this.agregarItem();

    if (this.mainForm.invalid || this.itemsFormArray.length === 0) return;

    this.saving = true;
    const payload = this.mainForm.value;

    this.catProductosService
      .saveCatalogoProductos(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          if(res.status == 'success'){
            this.alertasService.mostrarAlerta('Listo', res.message || 'Guardado correctamente', 'success', 'success');
            this.event.emit();
            this.cerrarModal();
          }
        },
        error: (err) => {
          const mensajeError = err.error?.message || err.message || 'Ocurrió un error';
          this.alertasService.mostrarAlerta('Error!', mensajeError, 'error', 'danger');
        },
      });
  }
}
