import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { ProveedoresService } from "src/app/core/services/compras/proveedores/proveedores.service";
import { CatEstadosService } from "src/app/core/services/cat-estados.service";

import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";

@Component({
  selector: "app-proveedores",
  templateUrl: "./proveedores.component.html",
  styleUrls: ["./proveedores.component.css"],
})
export class ProveedoresComponent implements OnInit {

  estados: any[] = [];
  public data: any;
  formData: FormData = new FormData();


  public showTable: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;
  public isCredit: boolean = false;


  dtOptions: Config = {};

  public modalRef?: BsModalRef;
  public submitted: boolean = false;
  public formProveedores: FormGroup;
  public formUpdateProveedores: FormGroup;

  public proveedor: any;
  public expediente: any;
  public archivos:any;

  constructor(
    private proveedoresService: ProveedoresService,
    private catEstadosService: CatEstadosService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.buildForm();
    this.getAll();
    this.selectLocalidad();
  }


  /**
   * Open modal
   * @param content modal content
   */
  public openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: "modal-lg" });
    this.mostrar = false;
  }

  public openModalupdate(update: any) {
    this.mostrar = false;
    this.submitted = false;
    this.modalRef = this.modalService.show(update, { class: "modal-lg" });
    this.formUpdateProveedores.patchValue({
      nombre: this.proveedor.nombre,
      contacto: this.proveedor.contacto,
      telefono: this.proveedor.telefono,
      localidad: this.proveedor.localidad,
      condiciones: this.proveedor.condiciones,
      servicios: this.proveedor.servicios,
      correo: this.proveedor.correo,
      dias_credito: this.proveedor.dias_credito,
      horario_atencion: this.proveedor.horario_atencion,
      tiempo_entrega: this.proveedor.tiempo_entrega,
      id: this.proveedor.id,
    });
    if (this.proveedor.condiciones === "Credito") {
      this.isCredit = true;
    }
  }

  public selectLocalidad() { //LLena el select localidad desde cat_estados.json
    this.catEstadosService.getData().subscribe((data) => {
      this.estados = data;
    });
  }
  
  public openModalExpediente(ModalExpediente: any) { //Abre el modal expediente
    this.mostrar = false;
    this.submitted = false;
    this.modalRef = this.modalService.show(ModalExpediente, {
      class: "modal-lg",
    });
    this.expediente.updated_at = new Date(this.expediente.updated_at).toLocaleString();
    this.archivos = this.expediente; //El elemento sleccionado se convierte en las rutas de los archivos
  }

  openFile(rutaArchivo: string) { // Funcion para abrir pdfs
     this.proveedoresService.abrirArchivo(rutaArchivo); 
    }


  private getExpediente() {
    this.proveedoresService.getExp(this.proveedor.id).subscribe(
      (response) => {
        if (response) {
          this.expediente = response;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formProveedores = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),

        contacto: new FormControl(null, [Validators.required]),
        telefono: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
        // telefono: new FormControl(null, Validators.required),
        localidad: new FormControl(null, Validators.required),
        condiciones: new FormControl(null, Validators.required),
        servicios: new FormControl(null, Validators.required),
        correo: new FormControl(null, Validators.required),
        horario_atencion: new FormControl(null, Validators.required),
        tiempo_entrega: new FormControl(null, Validators.required),
        dias_credito: new FormControl(null, [Validators.pattern("^[0-9]*$"),]),
        constancia_fiscal: new FormControl(null),
        ine: new FormControl(null),
        comprobante_domicilio: new FormControl(null),
        estado_cuenta: new FormControl(null),
        acta_constitutiva: new FormControl(null),
        poder_notarial: new FormControl(null),
      });

      this.formUpdateProveedores = this.formBuilder.group({
        id: new FormControl(null),
        nombre: new FormControl(null, Validators.required),
        contacto: new FormControl(null, Validators.required),
        // telefono: new FormControl(null, Validators.required),
        telefono: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"),]),
        localidad: new FormControl(null, Validators.required),
        condiciones: new FormControl(null, Validators.required),
        correo: new FormControl(null, Validators.required),
        horario_atencion: new FormControl(null, Validators.required),
        tiempo_entrega: new FormControl(null, Validators.required),
        dias_credito: new FormControl(null, [Validators.pattern("^[0-9]*$"),]),
        servicios: new FormControl(null, Validators.required),
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

  onFileChange(event: any, fieldName: string) { // Obtiene el archivo del select
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }

  public save() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formProveedores.invalid) {
      this.isLoad = false;
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
    // Comprueba si dias credito es igual a null
    //  y si lo es le asigan el valor de 0
    if (formValues.condiciones != "Credito"){
      formValues.dias_credito = 0;
    }

    for (let key in formValues) { //Procesa el formulario y los archivos para armar el payload
      if (formValues.hasOwnProperty(key) && formValues[key] !== null) {
        this.formData.append(key, formValues[key]);
      }
    }

    this.proveedoresService.save(this.formData).subscribe(
      // this.proveedoresService.save(this.data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.getAll();
          // console.log(response.message);
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
          this.isLoad = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );

    this.modalRef.hide();
    this.submitted = false;
    this.formProveedores.reset();

    this.formData = new FormData();
  }

  get proveedoresFormControl() {
    return this.formProveedores.controls;
  }

  get proveedoresFormControlUpdate() {
    return this.formUpdateProveedores.controls;
  }

  private getAll() {
    this.proveedoresService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.isLoad = false;
          this.showTable = true;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public edit() {
    this.isLoad = true;
    this.submitted = true;
    if (this.formUpdateProveedores.invalid) {
      this.isLoad = false;
      return;
    }


    // this.data = this.formUpdateProveedores.value;
    const formUpdateValues = this.formUpdateProveedores.value;
    let id = this.proveedor.id;

    if (formUpdateValues.condiciones != "Credito") {
      formUpdateValues.dias_credito = 0;
    }

    for (let key in formUpdateValues) {
      if (formUpdateValues.hasOwnProperty(key) && formUpdateValues[key] !== null) {
        this.formData.append(key, formUpdateValues[key]);
      }
    }

    
    this.formData.append('_method', 'PUT'); // Ajusto el metodo de la solictud para trabajar con form data

     this.proveedoresService.edit(id, this.formData).subscribe(
       (response) => {
         if (response.status === "success") {
           this.getAll();
           console.log(response.message);
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
           this.isLoad = false;
         } else {
           console.log(response.message);
         }
       },
       (error) => {
         console.error("Error fetching data:", error);
       }
     );
    this.modalRef.hide();
    this.submitted = false;
    this.formProveedores.reset();
    
    this.formData = new FormData();
  }

  public destroy() {
    this.mostrar = false;
    this.isLoad = true;
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Se eliminara el registro seleccionado",
      icon: "error",
      confirmButtonText: "Eliminiar",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.proveedoresService.destroy(this.proveedor.id).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.message);
              this.getAll();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            } else {
              console.log(response.message);
              Swal.fire({
                title: "Error!",
                text: "Your file has been deleted.",
                buttonsStyling: false,
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-danger px-4",
                  cancelButton: "btn btn- ms-2 px-4",
                },
              });
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
          }
        );
      }
      this.isLoad = false;
    });
  }
  
  public seleccionar(dato: any, evento: any) { //Función para resaltar el elemento seleccionado
    this.mostrar = true;
    this.proveedor = dato;
    this.isCredit = false;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.expediente = null;
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
      //?Obtenner aqui el expediente
      this.getExpediente();
    }
  }

  public onChange(selectElement: any) { // Función que muestra y oculta el campo días crédito
    let selectedText = selectElement.options[selectElement.selectedIndex].text;
    if (selectedText === "Credito") {
      this.isCredit = true;
    } else {
      this.isCredit = false;
    }
  }
}
