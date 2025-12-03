import { Component, Input, OnInit  } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { obtenerErroresFormulario } from 'src/app/core/helpers/errores-forrmulario';
@Component({
  selector: 'app-form-datos-poliza',
  templateUrl: './form-datos-poliza.component.html',
  styleUrl: './form-datos-poliza.component.css'
})
export class FormDatosPolizaComponent implements OnInit{


  @Input() datos: any = [];
  public formDatosPoliza: FormGroup;
  public submitted:boolean =  false;
  public fechaActual: any;
  public fechaFormateada: any;

  @Input() mostrarFormulario: any;

  public subramos =[
    { codigo: "9101", Nombre: "Automóviles", Descripcion: "Vehículos particulares y flotillas." },
    { codigo: "9102", Nombre: "Motocicletas", Descripcion: "Vehículos particulares y flotillas." },
    { codigo: "9103", Nombre: "Vehículos de carga", Descripcion: "Camiones, tractocamiones y transporte de mercancías (Auto tanques). " },
  ];

  public ramos =[
    { codigo: "0090", Nombre: "Vehículos", Descripcion: "Vehículos terrestres" },
  ];

  public periodicidadesPago = [
    { codigo: "3", Nombre: "Trimestral"},
    { codigo: "6", Nombre: "Semestral"},
    { codigo: "12", Nombre: "Anual"},
  ];

  public tiposMovimiento = [
    { codigo: "1", Nombre: "Individual"},
    { codigo: "2", Nombre: "Flotilla"},
  ];

  constructor(
      public formBuilder: FormBuilder,
    ){}

  ngOnInit(): void {
      this.buildForm();
    }

  private buildForm() {

    this.fechaActual = new Date();
    this.fechaFormateada = this.fechaActual.toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      this.formDatosPoliza = this.formBuilder.group({
        idSeguro: new FormControl( null),
        id_vehiculo_seguro: new FormControl(null),
        aseguradora: new FormControl(null, Validators.required),
        ramo: new FormControl("", Validators.required),
        subramo: new FormControl("", Validators.required),
        periodicidad_pago: new FormControl("", Validators.required),
        tipo_movimiento: new FormControl("", Validators.required),
        prima_total: new FormControl(null, Validators.required),
        cobertura: new FormControl(null, Validators.required),
        inicio_vigencia: new FormControl(null, Validators.required),
        fin_vigencia: new FormControl(null, Validators.required),
        numero_poliza: new FormControl(null, Validators.required),
        inciso: new FormControl(null, Validators.required),
        fecha_emision: new FormControl( this.fechaFormateada , Validators.required),
      });
      resolve(true);
    });
  }

  public actualizarValidadoresPoliza(): void {
  const campos = ['ramo', 'subramo', 'aseguradora', 'cobertura', 'inicio_vigencia',
     'fin_vigencia', 'numero_poliza', 'inciso', 'fecha_emision', 'prima_total',
    'periodicidad_pago', 'tipo_movimiento'];

  campos.forEach(campo => {
    const control = this.formDatosPoliza.get(campo);
    if (control) {
      if (!this.mostrarFormulario) {
        
        control.setValidators([Validators.required]);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity();
    }
  });
}

  get datosPolizaFormControl() {
    return this.formDatosPoliza.controls;
  }

  public llenarForm(){
    this.formDatosPoliza.patchValue({
      idSeguro: this.datos?.idSeguro,
      id_vehiculo_seguro: this.datos?.id_com_datos_vehiculo,
      ramo: this.datos?.ramo,
      subramo: this.datos?.sub_ramo,
      aseguradora: this.datos?.aseguradora,
      cobertura: this.datos?.cobertura,
      inicio_vigencia: this.datos?.inicio_vigencia,
      fin_vigencia: this.datos?.fin_vigencia,
      // tipo_vehiculo: this.datos?.tipo_vehiculo,
      numero_poliza: this.datos?.numero_poliza,
      inciso: this.datos?.inciso,
      fecha_emision: this.datos?.fecha_emision,
      prima_total: this.datos?.prima_total,
      periodicidad_pago: this.datos?.periodicidad_pago,
      tipo_movimiento: this.datos?.tipo_movimiento,
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
    this.formDatosPoliza.markAllAsTouched();
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

  mostrarErroresFormulario() {
      const errores = obtenerErroresFormulario(this.formDatosPoliza);
      if (errores.length > 0) {
        return errores[0]; // o mostrar todos
      }
    }



}
