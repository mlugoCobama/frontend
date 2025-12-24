import { Component , OnInit, Input} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { CatSistemasAutoService } from 'src/app/core/services/macrotaller/cat-sistemas-auto.service';
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';


@Component({
  selector: 'app-select-sistema-mantenimiento',
  templateUrl: './select-sistema-mantenimiento.component.html',
  styleUrl: './select-sistema-mantenimiento.component.css'
})
export class SelectSistemaMantenimientoComponent implements OnInit{

  @Input() solicitudCompra:  any;
  @Input() tipo:  number ;

  public isLoad: boolean = false;
  public submitted: boolean = false;

  sistemas = [];
  tiposMantenimiento = [];
  
  formSistemaMantenimiento: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private CatSistemasAuto: CatSistemasAutoService,
    private ComprasMacro: ComprasMacroService,
    private alerta:  SwalComprsServiceService

  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAll();
    // this.getTiposMantenimiento();
    this.selectChange();
  }


  public buildForm() {
    console.log(this.solicitudCompra)
  return new Promise((resolve, reject) => {
    const disabled = this.solicitudCompra?.auto_macro === 1 ? true: false;
    const sistemaValue = this.solicitudCompra?.sistema ?? '';
    const tipoValue = this.solicitudCompra?.tipo_mantenimiento ?? '';

    this.formSistemaMantenimiento = this.formBuilder.group({
      sistema: new FormControl({ value: sistemaValue,disabled: disabled }, Validators.required),
      tipoMantenimiento: new FormControl({ value: tipoValue, disabled: disabled }, Validators.required),
    });

    resolve(true);
  });
}

  get sisteMantenimientoFormControl() {
      return this.formSistemaMantenimiento.controls;
    }

  // Recupera todos los regsitros de la bse de datos 
  private getAll() {
    this.isLoad = true;
    this.CatSistemasAuto.getAll(this.tipo).subscribe(
      (response) => {
        if (response) {
          this.sistemas = response.data;
          this.tiposMantenimiento = response.data2;
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      }
    );
  }

  private getTiposMantenimiento() {
    this.isLoad = true;
    this.CatSistemasAuto.getTiposMantenimiento(this.tipo).subscribe(
      (response) => {
        if (response) {
          this.tiposMantenimiento = response.data;
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      }
    );
  }

  selectChange() {
    this.ComprasMacro.actualizarFormData(this.obtenerValores());
  }

    /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario ->
   * { empresa, usuario_destino, c_c, motivo, orden_trabajo }
   */
  obtenerValores() {
    return this.formSistemaMantenimiento.value;
  }
  /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    let bandera = this.formSistemaMantenimiento.valid;
    if(bandera === true){
      return bandera;
    }else{
      this.submitted = true;
      return bandera;
    }
  }

}
