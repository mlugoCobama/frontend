import { Component , OnInit, Input, Output, EventEmitter} from '@angular/core';

import {
  EmailValidator,
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
  @Input() tipo!:  number ;

  @Output() categoriaChange =  new EventEmitter()

  public isLoad: boolean = false;
  public submitted: boolean = false;

  sistemas = [];
  tiposMantenimiento = [];

  formSistemaMantenimiento!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private CatSistemasAuto: CatSistemasAutoService,
    private ComprasMacro: ComprasMacroService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAll();
    this.selectChange();
  }


  public buildForm() {
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
          if(this.tipo == 1){
            this.formSistemaMantenimiento.patchValue({ tipoMantenimiento: '7'});
          }
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
    const valores = this.obtenerValores();
    this.ComprasMacro.actualizarFormData(valores);

    const catSeleccionada: any = this.sistemas.find((item: any) => item.id === +valores.sistema);

    this.categoriaChange.emit({
      ...valores,
      useCatalogo: catSeleccionada ? catSeleccionada.useCatalogo == 1 : false
    });
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
  esValido(): boolean {
  this.submitted = !this.formSistemaMantenimiento.valid;
    return this.formSistemaMantenimiento.valid;
  }

  public setTextosDescriptivos(){
    const datos = [
      { tipo : 2, texto: 'Sistema del vehículo: ', complemeto: ' un sistema', keyword:'Sistema', mantenimiento:'Tipo de mantenimiento', visible: true},
      { tipo : 3, texto: 'Area de Infraestructuras / Soporte / TI: ', complemeto: ' un area', keyword:'Area', mantenimiento:'Tipo de mantenimiento', visible: true},
      { tipo : 1, texto: 'Categorias:', complemeto: ' una categoria', keyword:'categoria', mantenimiento:'Compra', visible: false },
    ];

    const resultado = datos.find(d => d.tipo === this.tipo);
    return resultado;

  }
  public habilitarCampos() {
    this.formSistemaMantenimiento.get('sistema')?.enable();
    this.formSistemaMantenimiento.get('tipoMantenimiento')?.enable();
  }

}
