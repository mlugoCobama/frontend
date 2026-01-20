import { Component , OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-tabulador',
  templateUrl: './form-tabulador.component.html',
  styleUrl: './form-tabulador.component.css'
})
export class FormTabuladorComponent {
formulario!: FormGroup;

@Input() datos:any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  /** Construcción del formulario*/
  buildForm(){
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      porcentaje: ['', Validators.required],
    });
  }

  get f() {
    return this.formulario.controls;
  }

  /**
   * Valida le formulario
   * @returns boolean : true o false
   */
  public isValid(){
    this.formulario.markAllAsTouched();
    return this.formulario.valid;
  }

  /**
   * Recupera los valores del formulario
   * @returns object : form values
   */
  public getValues(){
    return this.formulario.value;
  }

  /**
   * Set de valores en el form
   */
  public setValues() {
    this.formulario.patchValue({
      nombre: this.datos?.nombre,
      porcentaje: (+this.datos?.porcentaje || 0) * 100,
    });
  }
}
