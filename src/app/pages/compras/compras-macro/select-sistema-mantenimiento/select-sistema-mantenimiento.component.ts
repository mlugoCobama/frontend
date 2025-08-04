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
    this.getTiposMantenimiento();
    this.selectChange();
  }

  // public buildForm(){
  //    return new Promise((resolve, reject) => {
  //       this.formSistemaMantenimiento = this.formBuilder.group({
  //       sistema:  new FormControl([this.solicitudCompra?.sistema ?? ''], Validators.required),
  //       tipoMantenimiento:  new FormControl([this.solicitudCompra?.tipo_mantenimiento ?? ''], Validators.required),
  //     });
  //     resolve(true);
  //    });
  // }

  public buildForm() {
  return new Promise((resolve, reject) => {
    const sistemaValue = this.solicitudCompra?.sistema ?? '';
    const tipoValue = this.solicitudCompra?.tipo_mantenimiento ?? '';

    this.formSistemaMantenimiento = this.formBuilder.group({
      sistema: new FormControl({ value: sistemaValue, disabled: !!sistemaValue }, Validators.required),
      tipoMantenimiento: new FormControl({ value: tipoValue, disabled: !!tipoValue }, Validators.required),
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
    this.CatSistemasAuto.getAll().subscribe(
      (response) => {
        if (response) {
          this.sistemas = response.data;
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
    this.CatSistemasAuto.getTiposMantenimiento().subscribe(
      (response) => {
        if (response) {
          this.tiposMantenimiento = response.data;
          console.log(response.data)
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
    const valores = this.formSistemaMantenimiento.value;
    this.ComprasMacro.actualizarFormData(valores);
  }


}
