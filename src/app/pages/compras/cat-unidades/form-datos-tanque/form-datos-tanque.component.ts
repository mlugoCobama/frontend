import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-form-datos-tanque',
  templateUrl: './form-datos-tanque.component.html',
  styleUrl: './form-datos-tanque.component.css'
})
export class FormDatosTanqueComponent implements OnInit {
  
  @Input() datos: any;
  public formDatosTanques: FormGroup;
  public submitted:boolean =  false;

  constructor(
    public formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.buildForm();
  }

    private buildForm() {
    return new Promise((resolve, reject) => {
      this.formDatosTanques = this.formBuilder.group({
        id: new FormControl( null),
        id_sucursal: new FormControl( null),
        marca_tanque: new FormControl(null),
        anio_fabricacion: new FormControl( null, [
                                      Validators.pattern(/^\d{4}$/),
                                      Validators.min(1900),
                                      Validators.max(new Date().getFullYear())
                                    ]),
        serie: new FormControl(null),
        capacidad: new FormControl(null, [
                                          Validators.pattern(/^\d+(\.\d{1,2})?$/),
                                          Validators.min(0)
                                          ]),
        tipo_medidor: new FormControl(null),
      });
      resolve(true);
    });
  }

  get datosTanqueFormControl() {
    return this.formDatosTanques.controls;
  }

  public llenarForm(){
    this.formDatosTanques.patchValue({
      id: this.datos.id_tanque,
      id_sucursal: this.datos.id_sucursal,
      marca_tanque: this.datos.marca_tanque,
      anio_fabricacion: this.datos.anio_fabricacion,
      serie: this.datos.serie,
      capacidad: this.datos.capacidad,
      tipo_medidor: this.datos.tipo_medidor,
    });
  }

    /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario ->
   * { empresa, usuario_destino, c_c, motivo, orden_trabajo }
   */
  obtenerValores() {
    this.submitted = true;
    const value = this.formDatosTanques.value;
    return value;
  }

    /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    return this.formDatosTanques.valid;
  }

  /**
   * Resetea el formulario formSolicitud compra
   * @returns true
   */
  resetearFormulario() {
    this.submitted = false;
    this.formDatosTanques.reset();
  }

}
