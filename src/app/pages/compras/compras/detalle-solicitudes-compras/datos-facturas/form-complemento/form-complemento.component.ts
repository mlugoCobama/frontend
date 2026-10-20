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

  tiposDocumentos = [
    {id: "complemento_pago",  tipo_documento:"COMPLEMENTO DE PAGO"},
    {id: "comprobante_pago",  tipo_documento:"COMPROBANTE DE PAGO"},
    
    // {id: "factura_adjunta",   tipo_documento:"Factura x concepto extra"},
    // {id: "nota_crédito",   tipo_documento:"Nota de crédito"},
  ];

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formComplemento = this.formBuilder.group({
        tipo_documento: new FormControl("", Validators.required),
        archivo_xml: new FormControl(null),
        archivo: new FormControl(null),
      });
      resolve(true);
    });
  }

    get complementoFormControl() {
    return this.formComplemento.controls;
  }

  // onFileChange(event: any, controlName: string): void {
  //   if(event.target.files && event.target.files.length > 0 ){
  //     const file = event.target.files[0];
  //     this.formData.set(controlName, file);
  //   }
  // }

  onFileChange(event: any, controlName: string): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file && file.size > 0) {
      this.formData.set(controlName, file);
    }
  }
}



  obtenerValores() {
    return this.formData;
  }

  obtenerSelect(){
    return this.formComplemento.value.tipo_documento;
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
