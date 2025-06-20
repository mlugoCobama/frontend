import { Component, Input, OnInit, EventEmitter  } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";

import Swal from "sweetalert2";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";


@Component({
  selector: 'app-modal-updt-unidad',
  templateUrl: './modal-updt-unidad.component.html',
  styleUrls: ['./modal-updt-unidad.component.css']
})
export class ModalUpdtUnidadComponent {

  public formUpdateUnidades: FormGroup;
  public data: any;

  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();
    public proveedor: any;
    public expediente: any;
    public archivos:any;
    public tamanioExp:any;
    public submitted:boolean = false;

  constructor(
      public formBuilder: FormBuilder,
      private catUnidadesMedidasService: CatUnidadesMedidasService,
      private modalService: BsModalService,
      public bsModalRef: BsModalRef,
    ){}

    public ngOnInit(): void {
      this.buildForm();
      this.llenarForm();
    }

  public unidad: any;

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formUpdateUnidades = this.formBuilder.group({
        nombre: new FormControl(null, Validators.required),
        abreviatura: new FormControl(null, Validators.required),
      });
      resolve(true);
    });
  }

  get unidadesFormControlUpdate() {
    return this.formUpdateUnidades.controls;
  }

  public llenarForm(){
    this.formUpdateUnidades.patchValue({
      nombre: this.unidad.nombre,
      abreviatura: this.unidad.abreviatura,
      id: this.unidad.id,
    });
  }
  public edit() {
      // this.isLoad = true;
      this.submitted = true;
      if (this.formUpdateUnidades.invalid) {
        Swal.fire({
        title: "Falta algo!",
        text: "Llena correctamente el formulario",
        buttonsStyling: false,
        icon: "success",
        customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn- ms-2 px-4",
        },
      });
        return;
      }
      this.data = this.formUpdateUnidades.value;
      let id = this.unidad.id;
  
      this.catUnidadesMedidasService.edit(id, this.data).subscribe(
        (response) => {
          if (response.status === "success") {
            this.event.emit(true);
            this.modalCerrado.emit();
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
            // this.isLoad = false;
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
      this.cerrarModal();
      this.submitted = false;
      this.formUpdateUnidades.reset();
    }

  public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => {this.modalCerrado.emit();}, 150)
    
  }
}
