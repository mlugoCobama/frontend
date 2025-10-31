import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { requiredIf, multipleEmailsValidator } from 'src/app/validators/proveedor-custom-validators';
@Component({
  selector: 'app-form-proveedor-contactos',
  templateUrl: './form-proveedor-contactos.component.html',
  styleUrl: './form-proveedor-contactos.component.css'
})
export class FormProveedorContactosComponent implements OnInit{
  proveedorForm: FormGroup;
  @Input() datos:any

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
    if(this.datos){
      this.cargarContactos(this.datos);
    }
  }

  /**
   * Construccion del form array
   */
  buildForm(){
  this.proveedorForm = this.fb.group({
        contactos: this.fb.array([])
      });
  }

  /**
   * 
   */
  get contactos(): FormArray {
    return this.proveedorForm.get('contactos') as FormArray;
  }

  agregarContacto() {
    const contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, multipleEmailsValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9()+\-.,\sextEXT]*$/i)] ],
      zona: ['', Validators.required],
      notas: ['']
    });
    this.contactos.push(contactoForm);
  }

  cargarContactos(data: any[]) {
  const contactosArray = data.map(item => this.fb.group({
    nombre: [item.nombre || '', Validators.required],
    correo: [item.correo || '', [Validators.required, multipleEmailsValidator()]],
    telefono: [item.telefono || '', [Validators.required, Validators.pattern(/^[0-9()+\-.,\sextEXT]*$/i)]],
    zona: [item.zona || '', Validators.required],
    notas: [item.notas || '']
  }));

  this.proveedorForm.setControl('contactos', this.fb.array(contactosArray));
}


  eliminarContacto(index: number) {
    this.contactos.removeAt(index);
  }

  guardar() {
    if (this.proveedorForm.invalid) {
      this.contactos.controls.forEach(group => group.markAllAsTouched());
      return;
    }

    return this.proveedorForm.value
    // console.log();
  }

  /**
   * Atajo para validacion para 
   */
  isValid(){
    const arrayValido = this.proveedorForm.valid;
  // const todosValidos = this.proveedorForm.controls.every(control => control.valid);

  // const validacionGlobal = arrayValido && todosValidos;
    this.proveedorForm?.markAllAsTouched();
    return this.proveedorForm.valid;
  }

  /**
   * Valida que existan cambios entre los datos originales y los del formulario
   */
  hasContactosChanged(original: any[], actual: any[]): boolean {
  if (original.length !== actual.length) return true;

  return original.some((item, index) => {
    const actualItem = actual[index];
    return Object.keys(item).some(key => item[key] !== actualItem[key]);
  });
}


}
