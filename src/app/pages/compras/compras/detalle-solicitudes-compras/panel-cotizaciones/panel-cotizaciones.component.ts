import { Component, Input, Output, OnInit, EventEmitter, AfterViewInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from "@angular/forms";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ComprasService } from "src/app/core/services/compras/compras.service";

@Component({
  selector: "app-panel-cotizaciones",
  templateUrl: "./panel-cotizaciones.component.html",
  styleUrl: "./panel-cotizaciones.component.css",
})
export class PanelCotizacionesComponent implements OnInit {
  @Input() solicitudCompra: any = null;
  @Input() cotProv: any = null;
  @Output() actualizarStatus = new EventEmitter<void>();

  public formProveedoresCotizacion: FormGroup;
  public submitted: boolean = false;
  public isDisabled: boolean = false;
  public proveedores: any = [];
  public isLoad: boolean = true;

  constructor(
    public formBuilder: FormBuilder,
    public proveedoresService: ProveedoresService,
    public comprasService: ComprasService,
    public alertasService: SwalComprsServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getProveedores();
  }

  private buildForm() {
    this.formProveedoresCotizacion = this.formBuilder.group({
      // proveedores: this.formBuilder.array([this.crearProveedorControl()]),
      proveedores: this.formBuilder.array([this.crearProveedorGroup()]),
      consideraciones: new FormControl(null),
    });
  }

  // Crea un nuevo FormControl para un proveedor
  private crearProveedorControl(): FormControl {
    return new FormControl("", Validators.required);
  }
 // Crea un nuevo FormGroup para un proveedor
  private crearProveedorGroup(): FormGroup {
    return this.formBuilder.group({
      proveedor_id: ['', Validators.required],
      contacto_id: ['']
    });
  }

  // Getter para acceder al FormArray
  get proveedoresArray(): FormArray {
    return this.formProveedoresCotizacion.get("proveedores") as FormArray;
  }

  get solicitudCotizacionFormControl() {
    return this.formProveedoresCotizacion.controls;
  }

  // Agregar un nuevo proveedor al FormArray
  agregarProveedor() {
    if (this.proveedoresArray.length < 3) { // Límite opcional
      this.proveedoresArray.push(this.crearProveedorGroup());
    } else {
      this.alertasService.mostrarAlerta(
        "Límite alcanzado",
        "No puedes agregar más de 3 proveedores",
        "warning",
        "warning"
      );
    }
  }

  // Eliminar un proveedor del FormArray
  eliminarProveedor(index: number) {
    if (this.proveedoresArray.length > 1) {
      this.proveedoresArray.removeAt(index);
    } else {
      this.alertasService.mostrarAlerta(
        "Acción no permitida",
        "Debes tener al menos un proveedor",
        "warning",
        "warning"
      );
    }
  }

  // Recupera los registro de proveedores (ID, NOMBRE, SERVICIOS)
  private getProveedores() {
    this.proveedoresService.getProveedores().subscribe(
      (response) => {
        if (response) {
          this.proveedores = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            response.message,
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      }
    );
  }

  // Guarda el registro de la cotización y llama al servicio para enviar correos
  public enviarSolicitudCotizacion() {
    this.submitted = true;
    this.isDisabled = true;

    if (this.formProveedoresCotizacion.invalid || !this.validarProveedores()) {
      this.isLoad = false;
      this.isDisabled = false;
      return;
    }

    try {
      const idSolicitud = this.solicitudCompra.id;
      const proveedoresSeleccionados = this.proveedoresArray.value.filter((p: string) => p !== "");
      
      const data = {
        proveedores: proveedoresSeleccionados,
        consideraciones: this.formProveedoresCotizacion.value.consideraciones,
        solicitudes_compra_id: idSolicitud,
      };
      
      this.comprasService.sendMail(data).subscribe(
        (response) => {
          if (response.status === "success") {
            this.alertasService.mostrarAlerta(
              "Listo",
              "Tu solicitud de cotización se ha enviado con éxito",
              "success",
              "success"
            );
            this.formProveedoresCotizacion.reset();
            // Reiniciar el FormArray con un solo campo
            while (this.proveedoresArray.length > 1) {
              this.proveedoresArray.removeAt(1);
            }
            this.isLoad = false;
            this.isDisabled = false;
          } else {
            this.alertasService.mostrarAlerta(
              'Error',
             response.message,
              "error",
              "danger"
            );
            // console.log(response.errors);
            this.isDisabled = false;
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta(
            "Error!",
            error ?? "desconocido",
            "error",
            "danger"
          );
          this.isDisabled = false;
        }
      );
      this.isLoad = false;
    } catch (error) {
      this.alertasService.mostrarAlerta(
        "Error!",
        error ?? "desconocido",
        "error",
        "danger"
      );
      this.isDisabled = false;
    }
    
    this.submitted = false;
    this.actualizarStatus.emit();
  }

  /**
   * Validación de proveedores mínimo uno y ninguno repetido
   * @returns true or false
   */
  validarProveedores(): boolean {
    const proveedoresSeleccionados = this.proveedoresArray.value.filter(
      (p: string) => p !== ""
    );

    // Verificar que al menos uno esté presente
    if (proveedoresSeleccionados.length === 0) {
      this.alertasService.mostrarAlerta(
        "Algo anda mal",
        "Debes seleccionar al menos un proveedor",
        "warning",
        "warning"
      );
      return false;
    }

    // Verificar que los proveedores seleccionados no sean iguales
    const proveedoresUnicos = new Set(proveedoresSeleccionados);
    if (proveedoresUnicos.size !== proveedoresSeleccionados.length) {
      this.alertasService.mostrarAlerta(
        "Algo anda mal",
        "Debes seleccionar proveedores distintos",
        "warning",
        "warning"
      );
      return false;
    }

    return true;
  }


/**
 * Maneja el cambio en el dorm group cuando existen o no 
 * muestra u oculta un campo
 * @param index index del formArray para todo el formulario
 */  
onProveedorChange(index: number) {
  const proveedorCtrl = this.proveedoresArray.at(index) as FormGroup;
  const contactoCtrl = proveedorCtrl.get('contacto_id');
  if(contactoCtrl){
    console.log(this.tieneContactos(index));
    if (this.tieneContactos(index)) {
    contactoCtrl?.setValidators([Validators.required]);
  } else {
    contactoCtrl?.clearValidators();
    contactoCtrl?.setValue(null);
  }

  contactoCtrl?.updateValueAndValidity();
  }
  
}

/**
 * Recupera los contactos del proveedor
 * @param index index del formArray para todo el formulario
 * @returns contactos-proveedor
 */
getContactos(index: number): any[] {
  const proveedorId = this.proveedoresArray.at(index).get('proveedor_id')?.value;
  const proveedor = this.proveedores.find((p: any) => p.id === +proveedorId);
  return proveedor?.contactos || [];
}

/**
 * Valida que existan contactos
 * @param index index del formArray para todo el formulario
 * @returns true or false
 */
tieneContactos(index: number): boolean {
  return this.getContactos(index).length > 0;
}

}