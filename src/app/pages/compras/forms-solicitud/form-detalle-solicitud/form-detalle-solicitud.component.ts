import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";

@Component({
  selector: 'app-form-detalle-solicitud',
  templateUrl: './form-detalle-solicitud.component.html',
  styleUrl: './form-detalle-solicitud.component.css'
})

export class FormDetalleSolicitudComponent implements OnInit{
  
  public formDetalleSolicitud: FormGroup;
  public submittedDetail: boolean = false;
  public unidades: any;
  public unidad: any;
  public tableData: Array<any> = [];

  
  public formData = new FormData();

  @Input() autotanques = [];
  @Input() destino = null;

  constructor(
    public formBuilder: FormBuilder,
    private catUnidadesMedidasService: CatUnidadesMedidasService,
  ){}

  ngOnInit(): void {
    this.getUnidades();
    this.buildForm();
  }
  
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formDetalleSolicitud = this.formBuilder.group({
        cantidad: new FormControl(null, Validators.required),
        cat_unidades_medida_id: new FormControl("", Validators.required),
        descripcion: new FormControl(null, [Validators.required]),
        observaciones: new FormControl(null, []),
        img_referencia: new FormControl(null),
        cat_areas: new FormControl(""),
        vehiculo: new FormControl(""),
      });
      resolve(true);
    });
  }

  get detalleSolicitudFormControl() {
    return this.formDetalleSolicitud.controls;
  }

    /**
   * método que obtiene el texto del select unidad
   * @param selectElement eventos del select
   */
  public onChange(selectElement: any) {
    const selectedText =
      selectElement.options[selectElement.selectedIndex].text;
    this.unidad = selectedText;
  }

  /**
   * Función que captura el archivo en el input
   * @param event evento capturado del input
   * @param fieldName nombre del campo
   */
  onFileChange(event: any, fieldName: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }

    /**
   *  Agrega los detalles a el array detalle para después mostrarlo en la tabla
   */
  public addDetalle() {
    if (this.formDetalleSolicitud.invalid) {
      this.submittedDetail = true;
      return;
    }

    const valores = this.formDetalleSolicitud.value;
    let dato = null;

    if(+this.destino === 602 && !valores.vehiculo){
       this.submittedDetail = true;
       return;
    }

    if(+this.destino === 602){
      dato = this.autotanques.find(objeto => +objeto.id === +valores.vehiculo);
    }
    

    const newDetalle = {
      ...this.formDetalleSolicitud.value,
      cat_unidades_medida_id1: this.unidad,
      img_referencia1: valores.img_referencia,
      label: dato?.eco ?? null,
      confirmado: 1,
      // cat_areas: (this.centrosCostos[this.formSolicitudCompra.value.c_c-1].Clave)
    };

    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia1 = URL.createObjectURL(
        this.formData.get("img_referencia") as Blob
      );
    }

    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia = this.formData.get("img_referencia") as File;
    }

    this.tableData.push(newDetalle);

    this.formDetalleSolicitud.reset();

    this.formData.delete("img_referencia");

    this.submittedDetail = false;
  }
  
  /**
   * elimina el detalle del array detalles
   */
  public removeDetalle(index: number) {
    this.tableData.splice(index, 1);
  }

  /**
   * Recupera el catalogo de unidades
   */
  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidades = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
  
  /**
   * Recupera los datos almacenado en table data
   * @returns array: tableData
   */
  public getDetalles(){
    return this.tableData;
  }

  /**
   * Valida el form que agrega el detalle 
   * @returns boolean:true or false
   */
  esValido() {
    return this.formDetalleSolicitud.valid;
  }

  /**
   * Limpia el array de tableData
   */
  limpiarArray() {
    this.tableData = [];
  }

  /**
   * Valida si tiene detalles 
   * @returns boolean:true or false
   */
  hasDatos(){
    if(this.tableData.length === 0){
      return false
    }
      return true
  }
}
