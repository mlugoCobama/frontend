import { Component , OnInit, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-vendedores',
  templateUrl: './form-vendedores.component.html',
  styleUrl: './form-vendedores.component.css'
})
export class FormVendedoresComponent implements OnInit {
  formulario!: FormGroup;

  /** Data estática de agencias */
  @Input() agencias : object[] = [
    {value : 710 , name:'Nissan Universidad'},
    {value : 0 , name:'Nissan Insurgentes'},
    {value : 730 , name:'Nissan Azcapotzalco'},
    {value : 714 , name:'Nissan Campestre'},
    {value : 1 , name:'Renault Azcapotzalco'},
    {value : 2 , name:'Renault Ecatepec'},
    {value : 3 , name:'Renault Vallejo'},
    {value : 4 , name:'Renault Pachuca'},
  ];

  /** Data estática de tipos de vendedor */
  tipos: any[] = [
    {value : 1 , dsc:'Interno'},
    { value : 2 , dsc:'Externo'}
  ];

  @Input() datos:any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  /** Construcción del formulario*/
  buildForm(){
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      nroAutoSystem: ['', Validators.required],
      agencia: ['', Validators.required],
      tipo: ['', Validators.required]
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
      clave: this.datos?.clave,
      nroAutoSystem: this.datos?.nro_vendedor_as,
      agencia: this.datos?.agencia,
      tipo: this.datos?.tipo
    });
  }
}
