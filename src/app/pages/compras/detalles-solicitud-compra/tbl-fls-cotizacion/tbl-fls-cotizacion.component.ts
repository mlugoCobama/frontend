import { Component, Input, OnInit, TemplateRef, signal} from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import Swal from "sweetalert2";

@Component({
  selector: 'app-tbl-fls-cotizacion',
  templateUrl: './tbl-fls-cotizacion.component.html',
  styleUrls: ['./tbl-fls-cotizacion.component.css']
})
export class TblFlsCotizacionComponent implements OnInit{
  @Input() solicitudCompra: any;
  public cotProv: any[] = [];
  public formOrdenCompra: FormGroup;
  public mostrarObs: boolean = false;

    constructor(

      public formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.buildForm();
    }
  private buildForm() {

    this.formOrdenCompra = this.formBuilder.group({
      observaciones: new FormControl(null, Validators.required),
    });
  }
}
