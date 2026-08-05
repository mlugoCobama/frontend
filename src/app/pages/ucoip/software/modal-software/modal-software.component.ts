import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { CatSoftwareService } from "src/app/core/services/ucoip/cat-software.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import Swal from "sweetalert2";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { obtenerPrimerError } from "src/app/core/helpers/errores-forrmulario";

@Component({
  selector: 'app-modal-software',
  templateUrl: './modal-software.component.html',
  styleUrl: './modal-software.component.css'
})
export class ModalSoftwareComponent {

  public tipo: any = '';
  public empresas = [];

  public formSoftware!: FormGroup;
  public tipos = [];
  public data: any;

  public event: EventEmitter<any> = new EventEmitter();
  public modalCerrado: EventEmitter<any> = new EventEmitter();

  public submitted: boolean = false;
  public mostrarPassword: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private catSoftware: CatSoftwareService,
    // private modalService: BsModalService,
    public bsModalRef: BsModalRef,
  ) { }

  public ngOnInit(): void {
    this.buildForm();
    if (this.data) {
      this.setValues(this.data)
    }
  }

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSoftware = this.formBuilder.group({
        id: null,
        empresa: new FormControl("", Validators.required),
        cat_software_id: new FormControl(null, Validators.required),
        version: new FormControl(null, Validators.required),
        licencia: new FormControl(null, Validators.required),
        cuenta: new FormControl(''),
        pass_cuenta: new FormControl(''),
        fecha_adquisicion: new FormControl('', Validators.required),
        tipo_licencia: new FormControl('', Validators.required),
        estatus: new FormControl('', Validators.required),
        observaciones: new FormControl(''),
      });
      resolve(true);
    });
  }

  get unidadesFormControl() {
    return this.formSoftware.controls;
  }

  public save() {
    this.submitted = true;
    // this.event.emit(true);

    if (this.formSoftware.invalid) {
      Swal.fire({
        title: "Alerta",
        text: "Debes llenar correctamente todos los campos: " + obtenerPrimerError(this.formSoftware),
        buttonsStyling: true,
        icon: "warning",
      });
      return;
    }

    this.data = this.formSoftware.value;
    this.catSoftware.save(this.data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          this.modalCerrado.emit();
          // console.log(response.message);

          this.cerrarModal();
          this.submitted = false;
          this.formSoftware.reset();
          Swal.fire({
            title: "Guardado",
            text: "Licencia registrada correctamente",
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


  }

  public cerrarModal(): void {
    this.bsModalRef.hide();
  }


  public setValues(data: any) {
    this.formSoftware.patchValue({
      id: data?.id,
      empresa: data?.empresa,
      cat_software_id: data?.tipo_software?.id,
      version: data?.version,
      licencia: data?.licencia,
      observaciones: data?.observaciones,
      estatus: data?.estatus,
      tipo_licencia: data?.tipo_licencia,
      cuenta: data?.cuenta,
      pass_cuenta: data?.pass_cuenta,
      fecha_adquisicion: data?.fecha_adquisicion,
    });
  }
}
