import { Component, Input, OnInit, EventEmitter, ViewChild, AfterViewInit} from "@angular/core";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

import { FormDatosProveedorComponent } from "../forms/form-datos-proveedor/form-datos-proveedor.component";
import { FormExpedienteProveedorComponent } from "../forms/form-expediente-proveedor/form-expediente-proveedor.component";
import { FormProveedorContactosComponent } from "../forms/form-proveedor-contactos/form-proveedor-contactos.component";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

import { FormBuilder, FormControl, FormGroup, Validators,} from "@angular/forms";
import { FormDatosPagoComponent } from "../forms/form-datos-pago/form-datos-pago.component";

@Component({
  selector: "app-modal-updt-proveedor",
  templateUrl: "./modal-updt-proveedor.component.html",
  styleUrls: ["./modal-updt-proveedor.component.css"],
})
export class ModalUpdtProveedorComponent implements AfterViewInit {
  public estados: any;
  public proveedor: any;
  public tipo:any = 'Actualizar';


  public modalRef?: BsModalRef;
  public submitted: boolean = false;
  public isCredit: boolean = false;

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    private proveedoresService: ProveedoresService,
    private alertas : SwalComprsServiceService,
    private modalService: BsModalService,
    public bsModalRef: BsModalRef
  ) { }

  ngAfterViewInit(): void {
    console.log(this.proveedor)
  }

  @ViewChild('formDatosProveedor', { static: false }) formDatosProveedor!:  FormDatosProveedorComponent;
  @ViewChild('formExpedienteProveedor', { static: false }) formExpedienteProveedor!:  FormExpedienteProveedorComponent;
  @ViewChild('formProveedorContactos', { static: false }) formProveedorContactos!:  FormProveedorContactosComponent;
  @ViewChild("formDatosPago", { static: false }) formDatosPago!: FormDatosPagoComponent;

  public edit() {
    //Actualiza los valores del registro
    // this.isLoad = true;
    this.submitted = true;
    if (!this.formDatosProveedor.isValid() || !this.formProveedorContactos.isValid() ) {
      this.alertas.mostrarAlerta('La información esta incompleta', `agrega la información faltante para continuar`, 'info', 'warning')
      // this.isLoad = false;
      return;
    }

    let id = this.proveedor.id;

    const data = this.valoresFormatedos();

    if(!data){
      return;
    }

    this.proveedoresService.edit(id, data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          this.alertas.mostrarAlerta('Guardado', response.message, 'success', 'success');
          //  this.isLoad = false;
          this.cerrarModal();
          this.submitted = false;
        } else {
          this.alertas.mostrarAlerta('Ocurrio un error', response.message, 'error', 'danger');
        }
      },
      (error) => {
        this.alertas.mostrarAlerta('Error fetching data:', error, 'error', 'danger');
      }
    );
    
    // this.formUpdateProveedores.reset();

    // this.formData = new FormData();
  }

  public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => {this.modalCerrado.emit();}, 150)

  }

valoresFormatedos(): FormData {
  const formData = new FormData();

  const proveedor = this.formDatosProveedor.getFormValues();
  const contactos = this.formProveedorContactos.guardar();
  const datosPago =  this.formDatosPago.guardar();
  const expediente = this.formExpedienteProveedor.getFormValues(); // objeto con archivos
  const cambio = this.formProveedorContactos.hasContactosChanged(this.proveedor.contactos, contactos.contactos);
  const cambioProductos = this.formDatosProveedor.productosHasChange();

  const datosCambiaron =  this.formDatosPago.hasDatosChanged(this.proveedor.datosPago, datosPago.datosPago )

  if(contactos.contactos.length == 0){
     this.alertas.mostrarAlerta('Faltan los contactos', `Agrega por lo menos un contacto en el apartado de contactos`, 'info', 'warning')
     return;
   }

  formData.append('proveedor', JSON.stringify(proveedor));
  if(cambio){
    if(contactos.contactos.length > 0){
      formData.append("change_contactos", '1');
      formData.append('contactos', JSON.stringify(contactos));
    }
  }

  if(datosPago.datosPago.length == 0){
     this.alertas.mostrarAlerta('Faltan lo datos de pago', `Agrega por lo menos un dato de pago`, 'info', 'warning')
     return;
   }

  if(datosCambiaron && datosPago.datosPago.length > 0){
    formData.append("change_datosPago", '1');
      formData.append('datosPago', JSON.stringify(datosPago));
  }



  if(cambioProductos){
    formData.append("change_productos", '1');
  }

  // formData.append('contactos', JSON.stringify(contactos));

  Object.keys(expediente).forEach((key) => {
        const file = expediente[key];
        if (file instanceof File) {
          formData.append(key, file, file.name);
        }
  });

//  formData.append("_method", "PUT");
 return formData;
}
}
