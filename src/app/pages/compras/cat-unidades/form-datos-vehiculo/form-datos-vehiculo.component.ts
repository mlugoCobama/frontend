import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-form-datos-vehiculo',
  templateUrl: './form-datos-vehiculo.component.html',
  styleUrl: './form-datos-vehiculo.component.css'
})
export class FormDatosVehiculoComponent {

  @Input() datos: any = [];
  public formDatosVehiculo: FormGroup;
  public submitted:boolean = false;
  public intercompania:any = 0;
  
  constructor(
    public formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.buildForm();
  }

    private buildForm() {
    return new Promise((resolve, reject) => {
      this.formDatosVehiculo = this.formBuilder.group({
        id: new FormControl( null),
        id_sucursal: new FormControl( null),
        id_cre: new FormControl( null),
        marca: new FormControl(null, Validators.required),
        nro_economico: new FormControl(null, Validators.required),
        submarca: new FormControl( null, Validators.required),
        modelo: new FormControl(null, [Validators.required,
                                      Validators.pattern(/^\d{4}$/),
                                      Validators.min(1900),
                                      Validators.max(new Date().getFullYear())
                                    ]),
        no_serie: new FormControl(null, [Validators.required, Validators.minLength(17)]),
        placas: new FormControl(null, [Validators.required]),
        observacion: new FormControl(null),
        tipo_vehiculo: new FormControl("", [Validators.required]),
        tipo_combustible: new FormControl("", [Validators.required]),
        estatus: new FormControl("", [Validators.required]),
      });
      resolve(true);
    });
  }

  get datosVehiculoFormControl() {
    return this.formDatosVehiculo.controls;
  }

  public llenarForm(){
    this.formDatosVehiculo.patchValue({
      id: this.datos.id,
      id_cre: this.datos.id,
      nro_economico: this.datos.eco,
      id_sucursal: this.datos.id_sucursal,
      marca: this.datos.marca_vehiculo,
      submarca: this.datos.submarca,
      modelo: this.datos.modelo,
      no_serie: this.datos.no_serie,
      placas: this.datos.placas,
      tipo_vehiculo: this.datos.tipo_vehiculo,
      tipo_combustible: this.datos.tipo_combustible,
      estatus: this.datos.estatus,
    });
  }

    /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario ->
   * { empresa, usuario_destino, c_c, motivo, orden_trabajo }
   */
  obtenerValores() {
    this.submitted = true;
    const value = this.formDatosVehiculo.value;
    return value;
  }

    /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    return this.formDatosVehiculo.valid;
  }

  /**
   * Resetea el formulario formSolicitud compra
   * @returns true
   */
  resetearFormulario() {
    this.submitted = false;
    this.formDatosVehiculo.reset();
  }

}
