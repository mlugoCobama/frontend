import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';

@Component({
  selector: "app-form-expediente-proveedor",
  templateUrl: "./form-expediente-proveedor.component.html",
  styleUrl: "./form-expediente-proveedor.component.css",
})
export class FormExpedienteProveedorComponent implements OnInit {
  @Input() tipo: any;

  //Objeto que recibe las rutas de los inputs
  @Input() datos: any = {
    constancia_fiscal: null,
    ine: null,
    comprobante_domicilio: null,
    estado_cuenta: null,
    acta_constitutiva: null,
    poder_notarial: null,
    contrato: null,
    opinion_cumplimiento: null,
  };

  private archivos: Map<string, File> = new Map();

  expedienteForm: FormGroup;

  formData: FormData = new FormData();

  constructor(
    private formBuilder: FormBuilder,
    private proveedoresService : ProveedoresService
  ){}

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * Construcción del form
   * @returns 
   */
  buildForm() {
    return new Promise((resolve, reject) => {
      this.expedienteForm = this.formBuilder.group({
        constancia_fiscal: new FormControl ([null]),
        ine: new FormControl ([null]),
        comprobante_domicilio: new FormControl ([null]),
        estado_cuenta: new FormControl ([null]),
        acta_constitutiva: new FormControl ([null]),
        poder_notarial: new FormControl ([null]),
        contrato: new FormControl ([null]),
        opinion_cumplimiento: new FormControl ([null]),
      });
      resolve(true);
    });
  }

  /**
   * Atajo para acceder al las propiedades del form
   * @returns 
   */
  get expedienteFormControl() {
    return this.expedienteForm.controls;
  }

    openFile(rutaArchivo: string) { // Funcion para abrir pdfs
    this.proveedoresService.abrirArchivo(rutaArchivo); 
   }

  guardar() {
    if (this.expedienteForm.valid) {
      // console.log(this.expedienteForm.value);
    } else {
      alert("Completa todos los campos requeridos.");
    }
  }

  /**
   * Recupera los archivos del componente 
   * @returns objeto map con el par key, file
   */
  public getFormValues(){
    // return this.expedienteForm;
    // return this.formData;
    return this.archivos;

  }

  public getFormGroup() {
    return this.expedienteForm;
  }

  /**
   * Retorna la validación del formulario
   * @returns true = valido or false = no valido
   */
  isValid() {
    return this.expedienteForm.valid;
  }

  /**
   * Maneja los cambios en los input files
   * @param event evento del input 
   * @param fieldName nombre del campo o key que se le va dar al archivo en el form data
   * 
   */
  onFileChange(event: Event, fieldName: string) {
    event.stopPropagation();
    
    const input = event.target as HTMLInputElement;
    
    if (!input?.files || input.files.length === 0) {
      delete this.archivos[fieldName];
      this.expedienteForm.get(fieldName)?.setValue(null);
      return;
    }
    const file = input.files[0];
    
    this.archivos[fieldName] = file;
    this.expedienteForm.get(fieldName)?.setValue(file.name);
    this.expedienteForm.get(fieldName)?.markAsTouched();
  }
}

