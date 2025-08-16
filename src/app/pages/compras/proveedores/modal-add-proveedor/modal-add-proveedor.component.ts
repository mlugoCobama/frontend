import { Component, Input, OnInit, EventEmitter } from "@angular/core";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import Swal from "sweetalert2";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-modal-add-proveedor",
  templateUrl: "./modal-add-proveedor.component.html",
  styleUrls: ["./modal-add-proveedor.component.css"],
})
export class ModalAddProveedorComponent implements OnInit {
  public estados: any;

  public formProveedores: FormGroup;
  formData: FormData = new FormData();
  public modalRef?: BsModalRef;
  public submitted: boolean = false;
  public isCredit: boolean = false;

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef
  ) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formProveedores = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        contacto: new FormControl(null, [Validators.required]),
        telefono: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"),]),
        localidad: new FormControl('Selecciona uno', Validators.required),
        condiciones: new FormControl('Selecciona uno', Validators.required),
        servicios: new FormControl(null, Validators.required),
        correo: new FormControl(null, [Validators.required, Validators.email]),
        horario_atencion: new FormControl(null, Validators.required),
        tiempo_entrega: new FormControl(null, Validators.required),
        dias_credito: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
        constancia_fiscal: new FormControl(null),
        ine: new FormControl(null),
        comprobante_domicilio: new FormControl(null),
        estado_cuenta: new FormControl(null),
        acta_constitutiva: new FormControl(null),
        poder_notarial: new FormControl(null),
      });
      resolve(true);
    });
  }

  get proveedoresFormControl() {
    return this.formProveedores.controls;
  }

  public save() {
    // this.submitted = true;
    // this.isLoad = true;
    if (this.formProveedores.invalid) {
      // this.isLoad = false;
      Swal.fire({
        title: "Alerta",
        text: "Debes llenar correctamente todos los campos",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      return;
    }

    //this.data = this.formProveedores.value;
    const formValues = this.formProveedores.value;
    // Comprueba si días crédito es igual a null
    //  y si lo es le asigna el valor de 0
    if (formValues.condiciones != "Credito") {
      formValues.dias_credito = 0;
    }

    for (let key in formValues) {
      //Procesa el formulario y los archivos para armar el payload
      if (formValues.hasOwnProperty(key) && formValues[key] !== null) {
        this.formData.append(key, formValues[key]);
      }
    }

    this.proveedoresService.save(this.formData).subscribe(
      // this.proveedoresService.save(this.data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          Swal.fire({
            title: "Guardado",
            text: "Proveedor registrado correctamente",
            buttonsStyling: false,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-success px-4",
              cancelButton: "btn btn- ms-2 px-4",
            },
          });
          //this.isLoad = false;
        } else {
          this.mostrarErrores(response.errors)
          // Swal.fire({
          //   title: "Ocurrio un error",
          //   text: response.message,
          //   buttonsStyling: false,
          //   icon: "error",
          //   customClass: {
          //     confirmButton: "btn btn-danger px-4",
          //   },
          // });
        }
      },
      (error) => {
        Swal.fire({
          title: "Error fetching data:",
          text: error,
          buttonsStyling: false,
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger px-4",
          },
        });
      }
    );

    this.cerrarModal();
    // this.submitted = false;
    this.formProveedores.reset();

    this.formData = new FormData();
  }

  onFileChange(event: any, fieldName: string) {
    // Obtiene el archivo del input
    this.formData.delete(fieldName);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }

    public onChange(selectElement: any) {
    // Función que muestra y oculta el campo días crédito
    let selectedText = selectElement.options[selectElement.selectedIndex].text;
    if (selectedText === "Credito") {
      this.isCredit = true;
    } else {
      this.isCredit = false;
    }
    console.log(this.isCredit)
  }

  validateNumberInput(event: any) {
    // Valida que unicamente se tecleen números sobre el campo
    const inputValue = event.target.value;
    const validNumber = /^[0-9]*\.?[0-9]{0,2}$/.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
  }

  public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => {this.modalCerrado.emit();}, 150)
  }

  mostrarErrores(errores: any){
      let mensajes = '';
      for (let campo in errores){
        mensajes += `• ${errores[campo].join(', ')} \n`
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Errores de validación',
        text: mensajes,
      customClass:{
       popup : 'text-start'
      }
        })
    }
}
