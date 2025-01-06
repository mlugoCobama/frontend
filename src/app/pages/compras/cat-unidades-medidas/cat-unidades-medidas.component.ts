import { Component, OnInit } from "@angular/core";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";

import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";

@Component({
  selector: "app-cat-unidades-medidas",
  templateUrl: "./cat-unidades-medidas.component.html",
  styleUrls: ["./cat-unidades-medidas.component.css"],
})
export class CatUnidadesMedidasComponent implements OnInit {
  public data: any;
  public showTable: boolean = false;
  public isLoad: boolean = true;
  public mostrar: boolean = false;

  dtOptions: Config = {};

  public modalRef?: BsModalRef;
  public submitted: boolean = false;
  public formUnidades: FormGroup;
  public formUpdateUnidades: FormGroup;

  public unidad: any;

  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.getAll();
    this.buildForm();
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
    this.mostrar = false;
    this.submitted = false;
    this.modalRef = this.modalService.show(update, { class: "modal-lg" });
    this.formUpdateUnidades.patchValue({
      nombre: this.unidad.nombre,
      abreviatura: this.unidad.abreviatura,
      id: this.unidad.id,
    });
  }
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formUnidades = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        abreviatura: new FormControl(null, Validators.required),
      });
      this.formUpdateUnidades = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        abreviatura: new FormControl(null, Validators.required),
      });
      resolve(true);
    });
  }

  get unidadesFormControl() {
    return this.formUnidades.controls;
  }

  get unidadesFormControlUpdate() {
    return this.formUpdateUnidades.controls;
  }

  public save() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formUnidades.invalid) {
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
      this.isLoad = false;
      return;
    }
    this.data = this.formUnidades.value;
    this.catUnidadesMedidasService.save(this.data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.getAll();
          this.showTable = true;
          console.log(response.message);
          Swal.fire({
            title: "Guardado",
            text: "Unidad registrada correctamente",
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
    this.formUnidades.reset();
  }

  private getAll() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;
          this.isLoad = false;
          this.showTable = true;
          // console.log(this.data);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  public seleccionar(dato: any, evento: any) {
    this.mostrar = true;
    this.unidad = dato;
    if (evento.currentTarget.classList.contains("table-primary")) {
      evento.currentTarget.classList.remove("table-primary");
      this.mostrar = false;
    } else {
      const filas = document.querySelectorAll("tbody tr");
      filas.forEach((fila) => fila.classList.remove("table-primary"));
      evento.currentTarget.classList.add("table-primary");
    }
  }

  public destroy() {
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
        this.catUnidadesMedidasService.destroy(this.unidad.id).subscribe(
          (response) => {
            if (response.status === "success") {
              console.log(response.message);
              this.getAll();
              Swal.fire({
                title: "Borrado!",
                text: "El registro ha sido borrado.",
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

  public edit() {
    this.isLoad = true;
    this.submitted = true;
    if (this.formUpdateUnidades.invalid) {
      console.log("Formulario invalido");
      this.isLoad = false;
      return;
    }
    this.data = this.formUpdateUnidades.value;
    let id = this.unidad.id;

    this.catUnidadesMedidasService.edit(id, this.data).subscribe(
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
    this.formUpdateUnidades.reset();
  }
}
