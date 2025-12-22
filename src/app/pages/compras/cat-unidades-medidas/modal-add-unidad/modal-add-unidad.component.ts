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
  selector: 'app-modal-add-unidad',
  templateUrl: './modal-add-unidad.component.html',
  styleUrls: ['./modal-add-unidad.component.css']
})
export class ModalAddUnidadComponent implements OnInit {

  public formUnidades: FormGroup;
  public data: any;

  public event: EventEmitter<any> = new EventEmitter();
  public modalCerrado: EventEmitter<any> = new EventEmitter();

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
    }

    private buildForm() {
      return new Promise((resolve, reject) => {
        this.formUnidades = this.formBuilder.group({
          nombre: new FormControl(null, Validators.required),
          abreviatura: new FormControl(null, Validators.required),
        });
        resolve(true);
      });
    }

    get unidadesFormControl() {
      return this.formUnidades.controls;
    }

      public save() {
        this.submitted = true;
        // this.event.emit(true);

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
          this.event.emit(false);
          return;
        }
        this.data = this.formUnidades.value;
        this.catUnidadesMedidasService.save(this.data).subscribe(
          (response) => {
            if (response.status === "success") {
              this.event.emit(true);
              this.modalCerrado.emit();
              // console.log(response.message);
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
              // this.event.emit(false);
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
        this.formUnidades.reset();
      }

  public cerrarModal(): void {
    this.bsModalRef.hide();
    setTimeout(() => {this.modalCerrado.emit();}, 150)
  }
}
