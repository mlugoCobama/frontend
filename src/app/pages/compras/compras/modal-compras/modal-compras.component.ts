import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { environment } from "src/environments/environment";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { Config } from "datatables.net";
import Swal from "sweetalert2";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";

@Component({
  selector: "app-modal-compras",
  templateUrl: "./modal-compras.component.html",
  styleUrls: ["./modal-compras.component.css"],
  // standalone: true
})
export class ModalComprasComponent implements OnInit {
  public isLoad: boolean = false;
  public showTable: boolean = false;
  public formSolicitudCompra: FormGroup;
  public formDetalleSolicitud: FormGroup;

  public formData = new FormData();

  public submitted: boolean = false;
  public submittedDetail: boolean = false;

  text: string = "";
  longitudMaxima: number = 150;
  caracteresRestantes: number = this.longitudMaxima;

  public unidades: any;
  unidad: any;
  detalles: any;

  public usuarioActivo = {
    claveEmpresa: 333,
    nombreEmpresa: "CAS",
    idUsuario: 1,
  };

  /**
   * variable para regresar el evento
   */
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    private comprasService: ComprasService,
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef
  ) {}

  public ngOnInit(): void {
    this.getUnidades();
    this.buildForm();
  }
  /**
   * Construcción del formulario
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSolicitudCompra = this.formBuilder.group({
        usuario: new FormControl(null, Validators.required),
        usuario_destino: new FormControl(null, Validators.required),
        motivo: new FormControl(null, Validators.required),
      });
      this.formDetalleSolicitud = this.formBuilder.group({
        cantidad: new FormControl(null, Validators.required),
        cat_unidades_medida_id: new FormControl(null, Validators.required),
        descripcion: new FormControl(null, [
          Validators.required,
          Validators.maxLength(150),
        ]),
        observaciones: new FormControl(null, [
          Validators.required,
          Validators.maxLength(45),
        ]),
        img_referencia: new FormControl(null),
      });
      resolve(true);
    });
  }

  /**
   * Funciones form solicitud
   */

  get solicitudCompraFormControl() {
    return this.formSolicitudCompra.controls;
  }

  public contarCaracteres() {
    this.caracteresRestantes = this.longitudMaxima - this.text.length;
  }

  public save() {
    this.submitted = true;
    this.isLoad = true;
    if (this.formSolicitudCompra.invalid) {
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

    if (this.tableData.length === 0) {
      // Valida que el usuario ingrese por lo menos un detalle
      this.isLoad = false;
      Swal.fire({
        title: "Alerta",
        text: "Agrega por lo menos un elemento a la solicitud",
        buttonsStyling: false,
        icon: "warning",
        customClass: {
          confirmButton: "btn btn-warning px-4",
          cancelButton: "btn btn- ms-2 px-4",
        },
      });
      return;
    }
      const data = {
        //Datos del form solicitud
        ...this.formSolicitudCompra.value,
        usuario_solicita: "1",
        users_id: "1",
        detalles: this.tableData,
      };
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(data));
      this.tableData.forEach((detalle, index) => {
        //agrega los detalles al form data para enviarlos
        if (detalle.img_referencia) {
          formDataToSend.append(
            `img_referencia_${index}`,
            detalle.img_referencia
          );
        }
      });
      this.comprasService.save(formDataToSend).subscribe(
        (response) => {
          if (response.status === "success") {
            this.event.emit(true);
            this.showTable = true;
            Swal.fire({
              title: "Guardado",
              text: "Solicitud registrada correctamente",
              buttonsStyling: false,
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Hubo un error al guardar la solicitud",
              buttonsStyling: false,
              icon: "warning",
              customClass: {
                confirmButton: "btn btn-warning px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
      this.tableData = [];
      this.modalRef.hide();
      this.submitted = false;
      this.formSolicitudCompra.reset();
  }

  public cerrarModal(): void {
    this.modalRef.hide();
  }

  /**
   * Funciones detalle solicitud
   */
  get detalleSolicitudFormControl() {
    return this.formDetalleSolicitud.controls;
  }

  public onChange(selectElement: any) {
    // metodo que obtiene el texto del select unidad
    const selectedText =
      selectElement.options[selectElement.selectedIndex].text;
    this.unidad = selectedText;
  }

  onFileChange(event: any, fieldName: string) {
    // Funcion que captura el archivo en el input
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(fieldName, file);
    }
  }

  detalle = {
    cantidad: "",
    cat_unidades_medida_id: "",
    cat_unidades_medida_id1: "",
    img_referencia1: "",
    descripcion: "",
    observaciones: "",
    img_referencia: null,
  };
  tableData: Array<any> = [];

  public addDetalle() {
    if (this.formDetalleSolicitud.invalid) {
      this.submittedDetail = true;
      return;
    }
    const valores = this.formDetalleSolicitud.value;

    const newDetalle = {
      ...this.formDetalleSolicitud.value,
      cat_unidades_medida_id1: this.unidad,
      img_referencia1: valores.img_referencia,
    };

    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia1 = URL.createObjectURL(
        this.formData.get("img_referencia") as Blob
      );
    }
    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia = this.formData.get("img_referencia") as File;
    }
    this.tableData.push(newDetalle);
    this.formDetalleSolicitud.reset();
    this.formData.delete("img_referencia");
    this.submittedDetail = false;
  }

  public removeDetalle(index: number) {
    this.tableData.splice(index, 1);
  }

  private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidades = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}
