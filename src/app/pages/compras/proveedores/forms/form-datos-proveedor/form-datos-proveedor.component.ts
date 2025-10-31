import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { requiredIf, multipleEmailsValidator } from 'src/app/validators/proveedor-custom-validators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CatEstadosService } from "src/app/core/services/cat-estados.service";

@Component({
  selector: "app-form-datos-proveedor",
  templateUrl: "./form-datos-proveedor.component.html",
  styleUrl: "./form-datos-proveedor.component.css",
})
export class FormDatosProveedorComponent implements OnInit {
  @Input() estados: any;
  @Input() datos: any;

  public formProveedores: FormGroup;
  formData: FormData = new FormData();
  public submitted: boolean = false;
  public isCredit: boolean = false;

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService
  ) {}

  public ngOnInit(): void {
    this.buildForm();

    if (this.datos) {
      this.llenarForm();
    }
  }

  /**
   * Construye el formulario
   * @returns
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formProveedores = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        rfc: new FormControl(null, Validators.required),
        contacto: new FormControl(null, [Validators.required]),
        telefono: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[0-9()+\-.,\sextEXT]*$/i),
        ]),
        localidad: new FormControl("Selecciona uno", Validators.required),
        condiciones: new FormControl("Selecciona uno", Validators.required),
        servicios: new FormControl(null, Validators.required),
        correo: new FormControl(null, [
          Validators.required,
          multipleEmailsValidator(),
        ]),
        horario_atencion: new FormControl(null, Validators.required),
        tiempo_entrega: new FormControl(null, Validators.required),
        dias_credito: new FormControl(null, [
          Validators.pattern("^[0-9]*$"),
          requiredIf("condiciones", "Credito"),
        ]),
        productos: new FormControl(null),
      });
      resolve(true);
    });
  }

  /**
   * atajo para acceder a las propiedades del form
   */
  get proveedoresFormControl() {
    return this.formProveedores.controls;
  }

  /**
   *  Recupera los valores del form proveedores
   * @returns  valores de form value
   */
  getFormValues(): any {
    return this.formProveedores?.value;
  }

  /**
   * Valida que el form sea valido
   * @returns true = valido or false = no valido
   */
  isValid() {
    this.formProveedores?.markAllAsTouched();
    return this.formProveedores?.valid;
  }

  /**
   * Llena el form
   */
  public llenarForm() {
    this.formProveedores?.patchValue({
      id: this.datos?.id,
      nombre: this.datos?.nombre,
      rfc: this.datos?.rfc,
      contacto: this.datos?.contacto,
      telefono: this.datos?.telefono,
      localidad: this.datos?.localidad,
      condiciones: this.datos?.condiciones,
      servicios: this.datos?.servicios,
      correo: this.datos?.correo,
      horario_atencion: this.datos?.horario_atencion,
      tiempo_entrega: this.datos?.tiempo_entrega,
      dias_credito: this.datos?.dias_credito,
      productos: this.datos?.productos,
    });

    this.isCredit = this.datos?.condiciones == "Credito" ? true : false;
  }

  /**
   * Escucha los cambios en un select para mostrar u ocultar un campo
   * @param selectElement
   */
  public onChange(selectElement: any) {
    // Función que muestra y oculta el campo días crédito
    let selectedText = selectElement.options[selectElement.selectedIndex].text;
    if (selectedText === "Credito") {
      this.isCredit = true;
    } else {
      this.isCredit = false;
    }
  }

  /**
   * Valida que solo se ingresen números o caracteres con cierto patron
   * @param event evento del input
   */
  validateNumberInput(event: any) {
    // Valida que unicamente se tecleen números sobre el campo
    const inputValue = event.target.value;
    const validNumber = /^[0-9()+\-.\sextEXT]*$/i.test(inputValue);

    if (!validNumber) {
      event.target.value = inputValue.slice(0, -1);
    }
  }

  productosHasChangue() {
    const productos = this.formProveedores.get("productos").value;
    return productos != this.datos?.productos ? true : false;
  }
}
