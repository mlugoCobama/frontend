import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-form-complemento",
  templateUrl: "./form-complemento.component.html",
  styleUrl: "./form-complemento.component.css",
})
export class FormComplementoComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  public formComplemento: FormGroup;
  public submitted:boolean = false;
  public formData = new FormData();

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formComplemento = this.formBuilder.group({
        complemento_pago_xml: new FormControl("", Validators.required),
        complemento_pago_pdf: new FormControl("", Validators.required),
      });
      resolve(true);
    });
  }

  onFileChange(event: any, controlName: string): void {
    if(event.target.files && event.target.files.length > 0 ){
      const file = event.target.files[0];
      this.formData.set(controlName, file);
    }
  }

  obtenerValores() {
    return this.formData;
  }

  get solicitudCompraFormControl() {
    return this.formComplemento.controls;
  }

  esValido() {
    return this.formComplemento.valid;
  }

  resetearFormulario() {
    this.submitted = false;
    this.formData = new FormData();
    return this.formComplemento.reset();
  }
}
