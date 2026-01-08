import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';


@Component({
  selector: 'app-form-datos-pago',
  templateUrl: './form-datos-pago.component.html',
  styleUrl: './form-datos-pago.component.css'
})
export class FormDatosPagoComponent implements OnInit{
  proveedorForm: FormGroup;
  @Input() datos:any;

  constructor(
    private fb: FormBuilder,
    private alertas: SwalComprsServiceService
  ) {
    
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
  private buildForm(){
    this.proveedorForm = this.fb.group({
      datosPago: this.fb.array([]) 
    });
  }

  // Getter para acceder fácilmente al FormArray
  get datosPago(): FormArray {
    return this.proveedorForm.get('datosPago') as FormArray;
  }

  cargarContactos(data: any[]) {
    const contactosArray = data.map(item => this.fb.group({
      banco: [item.banco || '', Validators.required],
      no_cuenta: [item.no_cuenta || '', [Validators.required]],
      clave_interbancaria: [item.clave_interbancaria || '', [Validators.required]],
      beneficiario: [item.beneficiario || '', Validators.required]
    }));
  
    this.proveedorForm.setControl('datosPago', this.fb.array(contactosArray));
  }

  // Método para crear un grupo de datos de pago
  nuevoDatoPago(): FormGroup {
    return this.fb.group({
      banco: ['', Validators.required],
      no_cuenta: ['', Validators.required],
      clave_interbancaria: ['', Validators.required],
      beneficiario: ['', Validators.required],
    });
  }

  // Agregar un nuevo registro
  agregarDatoPago() {
    this.datosPago.push(this.nuevoDatoPago());
  }

  // Eliminar un registro por índice
  eliminarDatoPago(index: number) {
    this.datosPago.removeAt(index);
  }

  // Enviar formulario
  guardar() {
    if (this.proveedorForm.invalid) {
      this.alertas.mostrarAlerta("error", "Falta datos de pago", 'error', 'danger')
      this.datosPago.controls.forEach(group => group.markAllAsTouched());
      console.log(this.proveedorForm);
      return;
    }
    console.log(this.proveedorForm)
    return this.proveedorForm.value


  }
  
  isValid(){
    this.proveedorForm?.markAllAsTouched();
    return this.proveedorForm.valid;
  }

  /**
   * Valida que existan cambios entre los datos originales y los del formulario
   */
  hasDatosChanged(original: any[], actual: any[]): boolean {
    if (original.length !== actual.length) return true;

    return original.some((item, index) => {
      const actualItem = actual[index];
      return Object.keys(item).some(key => item[key] !== actualItem[key]);
    });
  }
}
