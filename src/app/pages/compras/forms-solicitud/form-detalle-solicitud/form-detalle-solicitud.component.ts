import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";
import {  obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import Swal from 'sweetalert2';

interface UnidadMedida {
  id: number;
  nombre: string;
  abreviatura: string;
}

interface Producto {
  id: number;
  com_cat_unidad_medida_id: number;
  descripcion_planta: number;
  descripcion_proveedor: string;
  unidad_medida: UnidadMedida;
  [key: string]: any;
}

interface Autotanque {
  id: number | string;
  eco: string;
  [key: string]: any;
}

@Component({
  selector: 'app-form-detalle-solicitud',
  templateUrl: './form-detalle-solicitud.component.html',
  styleUrl: './form-detalle-solicitud.component.css'
})

export class FormDetalleSolicitudComponent implements OnInit, OnChanges {

  public formDetalleSolicitud!: FormGroup;
  public submittedDetail: boolean = false;
  public unidades: UnidadMedida[] = [];
  public unidad: string = '';
  public tableData: Array<any> = [];

  public formData = new FormData();

  @Input() productosCategoria: any[] = [];
  @Input() autotanques: Autotanque[] = [];
  @Input() destino: number | string | null = null;
  @Input() subCategorias: any = [];
  @Input() useCatalogo:boolean = false;

  subcategoriaSeleccionada: any = '';
  productoSeleccionado: any = '';

  public productos: Producto[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private catUnidadesMedidasService: CatUnidadesMedidasService,
  ){}

  ngOnInit(): void {
    this.getUnidades();
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['destino'] && this.formDetalleSolicitud) {
      this.setVehiculoValidator(this.destino);
    }
  }

  private buildForm(): void {
    this.formDetalleSolicitud = this.formBuilder.group({
      id_producto: [null],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      descripcion: [null, [Validators.required]],
      cat_unidades_medida_id: ["", Validators.required],
      observaciones: [null, []],
      img_referencia: [null],
      recuperar_costo: ["", [Validators.required]],
      cat_areas: [""],
      vehiculo: [""]
    });

    this.setVehiculoValidator(this.destino);
  }

  public setVehiculoValidator(destino: any) {
    const vehiculoControl = this.formDetalleSolicitud.get('vehiculo');
    if (+destino === 602) {
      vehiculoControl?.setValidators([Validators.required]);
    } else {
      vehiculoControl?.clearValidators();
    }
    vehiculoControl?.updateValueAndValidity();
  }

  get detalleSolicitudFormControl() {
    return this.formDetalleSolicitud.controls;
  }

  /**
   * Método que obtiene el texto del select unidad
   */
  public onChange(selectElement: any) {
    const selectedText = selectElement.options[selectElement.selectedIndex]?.text;
    this.unidad = selectedText || '';
  }

  /**
   * Función que captura el archivo en el input
   */
  onFileChange(event: any, fieldName: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.set(fieldName, file)
    }
  }

  /**
   * Agrega los detalles al array para después mostrarlo en la tabla
   */
  public addDetalle() {
    this.submittedDetail = true;

    if (this.formDetalleSolicitud.invalid) {
      this.mostrarErroresFormulario();
      return;
    }

    const valores = this.formDetalleSolicitud.value;
    let dato: Autotanque | undefined = undefined;

    if (+this.destino! === 602) {
      dato = this.autotanques.find(objeto => +objeto.id === +valores.vehiculo);
    }

    let imgUrl = null;
    if (this.formData.has("img_referencia")) {
      const fileBlob = this.formData.get("img_referencia") as Blob;
      imgUrl = URL.createObjectURL(fileBlob);
    }

    const newDetalle = {
      ...valores,
      cat_unidades_medida_id1: this.unidad,
      img_referencia1: imgUrl,
      img_referencia: this.formData.get("img_referencia") as File || null,
      label: dato?.eco ?? null,
      confirmado: 1,
    };

    this.tableData.push(newDetalle);
    this.resetFormDetalle();
    this.formData.delete("img_referencia");
    this.submittedDetail = false;
  }

  private resetFormDetalle() {
    this.formDetalleSolicitud.reset({
      id_producto: null,
      cantidad: null,
      cat_unidades_medida_id: "",
      descripcion: null,
      observaciones: null,
      img_referencia: null,
      recuperar_costo: "",
      cat_areas: "",
      vehiculo: ""
    });
    this.setVehiculoValidator(this.destino);
  }

  /**
   * Elimina el detalle del array tableData
   */
  public removeDetalle(index: number) {
    this.tableData.splice(index, 1);
  }

  /**
   * Recupera el catálogo de unidades
   */
  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe({
      next: (response: any) => {
        if (response) {
          this.unidades = response.data;
        } else {
          console.warn(response.message);
        }
      },
      error: (error) => {
        console.error("Error fetching units:", error);
      }
    });
  }

  public getDetalles() {
    return this.tableData;
  }

  esValido() {
    return this.formDetalleSolicitud.valid;
  }

  limpiarArray() {
    this.formData = new FormData();
    this.tableData = [];
  }

  hasDatos() {
    return this.tableData.length > 0;
  }

  mostrarErroresFormulario() {
    const primerError = obtenerPrimerError(this.formDetalleSolicitud);
    if (primerError) {
      Swal.fire({
        icon: 'error',
        title: 'Falta información importante',
        text: primerError,
      });
    }
  }

  public loadDetallesFromDB(detalles: any[]) {
    this.tableData = detalles.map(detalle => {
      return {
        ...detalle,
        cat_unidades_medida_id: detalle?.unidadMedida?.id,
        cat_unidades_medida_id1: `${detalle?.unidadMedida?.nombre} (${detalle?.unidadMedida?.abreviatura})`,
        img_referencia1: null,
        label: detalle?.DetalleAutotanque?.DatosVehiculo?.eco ?? null,
        vehiculo: detalle?.DetalleAutotanque?.com_datos_vehiculo_id ?? null,
        confirmado: 1
      };
    });
  }

  selectCategoria(value: any) {
    const categoriaId = +value;
    const categoriaEncontrada = this.subCategorias?.sub_categorias?.find(
      (item: any) => item.id === categoriaId
    );
    this.productos = categoriaEncontrada?.productos_activos || [];
    this.productoSeleccionado = '';
  }

  selectProducto(value: any) {
    const productoId = +value;
    const producto = this.productos.find((item: any) => item.id === productoId);

    if (producto) {
      this.formDetalleSolicitud.patchValue({
        id_producto: producto.id,
        cat_unidades_medida_id: producto.com_cat_unidad_medida_id,
        descripcion: producto.descripcion_proveedor,
      });

      if (producto.unidad_medida) {
        this.unidad = `${producto.unidad_medida.nombre} (${producto.unidad_medida.abreviatura})`;
      }
    }
  }
}
