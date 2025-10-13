import { Component, Input, OnInit  } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-form-datos-poliza',
  templateUrl: './form-datos-poliza.component.html',
  styleUrl: './form-datos-poliza.component.css'
})
export class FormDatosPolizaComponent {

  @Input() datos: any = [];
  public formDatosPoliza: FormGroup;
  public submitted:boolean =  false;

  constructor(
      public formBuilder: FormBuilder,
    ){}

  ngOnInit(): void {
      this.buildForm();
    }



  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formDatosPoliza = this.formBuilder.group({
        idSeguro: new FormControl( null),
        id_vehiculo_seguro: new FormControl(null),
        inciso_vehiculo: new FormControl(null, Validators.required),
        aseguradora: new FormControl(null, Validators.required),
        cobertura: new FormControl(null, Validators.required),
        inicio_vigencia: new FormControl(null, Validators.required),
        fin_vigencia: new FormControl(null, Validators.required),
        flotilla: new FormControl(null, Validators.required),
        inciso_foltilla: new FormControl(null, Validators.required),
      });
      resolve(true);
    });
  }

  get datosPolizaFormControl() {
    return this.formDatosPoliza.controls;
  }

  public llenarForm(){
    this.formDatosPoliza.patchValue({
      idSeguro: this.datos.idSeguro,
      id_vehiculo_seguro: this.datos.id_com_datos_vehiculo,
      inciso_vehiculo: this.datos.inciso_vehiculo,
      aseguradora: this.datos.aseguradora,
      cobertura: this.datos.cobertura,
      inicio_vigencia: this.datos.inicio_vigencia,
      fin_vigencia: this.datos.fin_vigencia,
      tipo_vehiculo: this.datos.tipo_vehiculo,
      flotilla: this.datos.flotilla,
      inciso_foltilla: this.datos.inciso_foltilla,
    });
  }

      /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario ->
   * { empresa, usuario_destino, c_c, motivo, orden_trabajo }
   */
  obtenerValores() {
    this.submitted = true;
    const value = this.formDatosPoliza.value;
    return value;
  }

    /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    return this.formDatosPoliza.valid;
  }

  /**
   * Resetea el formulario formSolicitud compra
   * @returns true
   */
  resetearFormulario() {
    this.submitted = false;
    this.formDatosPoliza.reset();
  }



}
