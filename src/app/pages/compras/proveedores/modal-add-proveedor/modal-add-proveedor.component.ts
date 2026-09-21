import { Component, Input, OnInit, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";

import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import Swal from "sweetalert2";

import { FormDatosProveedorComponent } from "../forms/form-datos-proveedor/form-datos-proveedor.component";
import { FormExpedienteProveedorComponent } from "../forms/form-expediente-proveedor/form-expediente-proveedor.component";
import { FormProveedorContactosComponent } from "../forms/form-proveedor-contactos/form-proveedor-contactos.component";
import { FormDatosPagoComponent } from "../forms/form-datos-pago/form-datos-pago.component";
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
export class ModalAddProveedorComponent implements AfterViewInit {
  public estados: any;

  // public formProveedores!: FormGroup;
  formData: FormData = new FormData();
  public modalRef?: BsModalRef;
  public submitted: boolean = false;
  public isCredit: boolean = false;
  public tipo = '';

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild("formDatosProveedor", { static: false }) formDatosProveedor!: FormDatosProveedorComponent;
  @ViewChild("formExpedienteProveedor", { static: false }) formExpedienteProveedor!: FormExpedienteProveedorComponent;
  @ViewChild("formProveedorContactos", { static: false }) formProveedorContactos!: FormProveedorContactosComponent;
  @ViewChild("formDatosPago", { static: false }) formDatosPago!: FormDatosPagoComponent;

  constructor(
    public formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef,
    private alertas : SwalComprsServiceService,
  ) {}

  public ngAfterViewInit(): void {
  }


  public save() {
    if (!this.formDatosProveedor.isValid() || !this.formProveedorContactos.isValid() ) {
      this.alertas.mostrarAlerta("Alerta", "Debes llenar correctamente todos los campos", "warning", "warning");
      return;
    }

    const data = this.valoresFormatedos();

    if(!data){
      return;
    }


    this.proveedoresService.save(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          this.alertas.mostrarAlerta("Guardado", "Proveedor registrado correctamente", "success", "success");
          this.cerrarModal();
          this.formData = new FormData();
        } else {
          this.alertas.mostrarAlerta("Error fetching data:", response.message, "error", "danger");
          return;
        }
      },
      (error) => {
        this.alertas.mostrarAlerta("Error fetching data:", error, "error", "danger");
        return;
      }
    );
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
    // console.log(this.isCredit);
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
    setTimeout(() => {
      this.modalCerrado.emit();
    }, 150);
  }

  valoresFormatedos(){
    const formData = new FormData();
    const proveedor = this.formDatosProveedor.getFormValues();
    const contactos = this.formProveedorContactos.guardar();
    const expediente = this.formExpedienteProveedor.getFormValues(); // objeto con archivos
    const datosPago = this.formDatosPago.guardar();

    if(contactos.contactos.length == 0){
       this.alertas.mostrarAlerta('Faltan los contactos', `Agrega por lo menos un contacto en el apartado de contactos`, 'info', 'warning')
       return;
   }

   if(datosPago.datosPago.length > 0){
      formData.append("datosPago", JSON.stringify(datosPago));
      //  this.alertas.mostrarAlerta('Faltan los datos de pago', `Agrega por lo menos datos de pagos`, 'info', 'warning')
      //  return;
   }
   proveedor.tipo = this.tipo;
    formData.append("proveedor", JSON.stringify(proveedor));
    // formData.append("datosPago", JSON.stringify(datosPago));
    formData.append("contactos", JSON.stringify(contactos));

    // Agregar archivos del expediente solo si existen
    Object.keys(expediente).forEach((key) => {
        const file = expediente[key];
        if (file instanceof File) {
          formData.append(key, file, file.name);
        }
      });

    return formData;
  }

}
