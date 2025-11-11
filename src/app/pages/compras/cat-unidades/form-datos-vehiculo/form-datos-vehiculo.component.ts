import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-datos-vehiculo',
  templateUrl: './form-datos-vehiculo.component.html',
  styleUrl: './form-datos-vehiculo.component.css'
})
export class FormDatosVehiculoComponent implements OnInit{

  @Output() cambioSelect = new EventEmitter<any>();

  etatusVehiculo = [
    {"numero": 1 , "descripcion": "Activa"},
    {"numero": 0 , "descripcion": "Fuera de circulación"},
    {"numero": 2, "descripcion": "En taller"},
    {"numero": 3, "descripcion": "Vendida"},
    {"numero": 4, "descripcion": "No identificada"},
    {"numero": 5, "descripcion": "Descompuesta"},
    {"numero": 6, "descripcion": "En Fiscalia"},
    {"numero": 7, "descripcion": "En Deposito vehicular"},
    {"numero": 8, "descripcion": "Chatarra"},
    {"numero": 9, "descripcion": "Vendida como chatarra"},
    {"numero": 10, "descripcion": "Baja"},
  ];

  categorias = [
    {"id": 1 , "descripcion": "Propia" , "abreviatura": "PPA" },
    {"id": 2 , "descripcion": "Propia prestada a comisionista", "abreviatura": "PPC" },
    {"id": 3, "descripcion": "Comisionista", "abreviatura": "CTA" },
    {"id": 4, "descripcion": "No especificado", "abreviatura": "NES" },
  ];

  categoriasGPS = [
    {"id": 1, "descripcion": "SI, REPORTANDO" , "class": "fa-solid fa-satellite-dish text-success" },
    {"id": 2, "descripcion": "SI, NO REPORTA", "class": "fa-solid fa-triangle-exclamation text-warning" },
    {"id": 3,  "descripcion": "NO TIENE", "class": "fa-solid fa-ban text-danger" },
  ];

  @Input() datos: any = [];
  public formDatosVehiculo: FormGroup;
  public submitted:boolean = false;
  public intercompania:any = 0;
  private valorOriginalEstatus: any = this.datos?.estatus;

  
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
        categoria: new FormControl("", [Validators.required]),
        gps: new FormControl("", [Validators.required]),
      });

    this.valorOriginalEstatus = this.formDatosVehiculo.get('estatus')?.value || '' || this.datos?.estatus;
    // Suscripción para detectar cambios
    this.formDatosVehiculo.get('estatus')?.valueChanges.subscribe(valor => {
      const observacionControl = this.formDatosVehiculo.get('observacion');

      if (valor !== this.valorOriginalEstatus && (Object.keys(this.datos).length > 0 || this.datos.length > 0) ) {
        observacionControl?.setValidators([Validators.required]);
      } else {
        observacionControl?.clearValidators();
      }

      observacionControl?.updateValueAndValidity();
    });


      resolve(true);
    });
  }

  get datosVehiculoFormControl() {
    return this.formDatosVehiculo.controls;
  }

  public llenarForm(){
    this.formDatosVehiculo.patchValue({
      id: this.datos?.id,
      id_cre: this.datos?.id_cre,
      nro_economico: this.datos?.eco,
      id_sucursal: this.datos?.id_sucursal,
      marca: this.datos?.marca_vehiculo,
      submarca: this.datos?.submarca,
      modelo: this.datos?.modelo,
      no_serie: this.datos?.no_serie,
      placas: this.datos?.placas,
      tipo_vehiculo: this.datos?.tipo_vehiculo,
      tipo_combustible: this.datos?.tipo_combustible,
      estatus: this.datos?.estatus,
      categoria: this.datos?.categoria,
      gps: this.datos?.gps,
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
    this.mostrarErroresFormulario();
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

  selectChange() {
    // Emite el evento con el valor "Hola desde el hijo"
    this.cambioSelect.emit();
  }

  mostrarErroresFormulario() {
  const errores: string[] = [];

  Object.keys(this.formDatosVehiculo.controls).forEach(campo => {
    const control = this.formDatosVehiculo.get(campo);

    if (control && control.invalid) {
      const nombreCampo = campo.replace(/_/g, ' '); // opcional: más legible

      if (control.errors?.['required']) {
        errores.push(`El campo "${nombreCampo}" es obligatorio.`);
      }

      if (control.errors?.['minlength']) {
        errores.push(`"${nombreCampo}" debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`);
      }

      if (control.errors?.['pattern']) {
        errores.push(`"${nombreCampo}" tiene un formato inválido.`);
      }

      if (control.errors?.['min']) {
        errores.push(`"${nombreCampo}" debe ser mayor o igual a ${control.errors['min'].min}.`);
      }

      if (control.errors?.['max']) {
        errores.push(`"${nombreCampo}" debe ser menor o igual a ${control.errors['max'].max}.`);
      }
    }
  });

  if (errores.length > 0) {

    return errores[0];
    // Swal.fire({
    //   icon: 'error',
    //   title: 'Errores en el formulario',
    //   html: `<ul style="text-align:left;">${errores.map(e => `<li>${e}</li>`).join('')}</ul>`,
    // });
  }
}



}
