import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import catCentrosCostos from "src/environments/cat_centros_costos.json";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

//services
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { CatUnidadesMedidasService } from "src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { first } from "rxjs";

@Component({
  selector: "app-modal-compras",
  templateUrl: "./modal-compras.component.html",
  styleUrls: ["./modal-compras.component.css"],
})
export class ModalComprasComponent implements OnInit {
  public isLoading: boolean = true;
  public submittedDetail: boolean = false;
  public isLoad: boolean = false;
  public showTable: boolean = false;
  public submitted: boolean = false;
  public disabled: boolean = false;

  public formSolicitudCompra: FormGroup;
  public formDetalleSolicitud: FormGroup;

  public centrosCostos = catCentrosCostos;

  // public text: string = "";
  // public longitudMaxima: number = 150;
  // public caracteresRestantes: number = this.longitudMaxima;

  public unidades: any;
  public unidad: any;
  public detalles: any;
  public empresas: any;
  public usuarios: any;
  public usuarioSolicita: any = {
    id: null,
    firstname: "",
    realname: "",
    name: "",
    puesto: "",
    Telfono: "",
    direccion: "",
    intercompania: 333,
    empresa: "",
    isAgencia: false
    };

  public event: EventEmitter<any> = new EventEmitter();
  public tableData: Array<any> = [];
  public formData = new FormData();

  public usuarioActivo = {
    claveEmpresa: 333,
    nombreEmpresa: "CAS",
    idUsuario: 1,
  };

  /**
   * variable para regresar el evento
   */
  constructor(
    private catUnidadesMedidasService: CatUnidadesMedidasService,
    private alertasService: SwalComprsServiceService,
    private usuariosService: UsuariosService,
    private comprasService: ComprasService,
    private localStorage: LocalStorageServiceService,
    public formBuilder: FormBuilder,
    public modalRef: BsModalRef
  ) {}

  public ngOnInit(): void {
    this.getUnidades();
    this.getEmpresas();
    this.buildForm();
    this.getUsuarioActivo();
  }

  public interAgencias = [
    7102, 7075, 7074, 7072, 7071, 7064, 7063, 7062, 7061, 7051, 712, 710, 706,
  ];
  public isAgencia: boolean = false;

  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          this.empresas = response.data;
          this.isLoading = false;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  /**
   * Recupera el usuario activo en el local storage
   */
  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      // this.usuariosService.getUserById("mlugo@cobama.com.mx").subscribe(
      (response) => {
        if (response.status === "success") {

          this.usuarioSolicita = response.data[0];
          this.getUsuarios(this.usuarioSolicita.intercompania);
          this.formSolicitudCompra.patchValue({empresa :  this.usuarioSolicita.intercompania});
          // console.log(this.usuarioSolicita);

        } else {
          this.alertasService.mostrarAlerta(
            response.message,
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );

          this.cerrarModal();
          return;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  /**
   * Recupera los usuarios que pertenecen a las empresas (Select usuario)
   * @param intercompania num de intercompania
   */
  public getUsuarios(intercompania: any) {
    this.usuarios = [];
    this.isLoad = false;
    this.disabled = false;
    this.isAgencia = this.interAgencias.some((num) => num === Number(intercompania));
    if (intercompania != "" && this.isAgencia === false) {
      this.usuariosService.getUsuariosEmpresas(intercompania).subscribe(
        (response) => {
          if (response) {
            if (response.data.length > 0) {
              this.usuarios = response.data;
              this.isLoad = true;
            } else {
              this.usuarios = [
                { id: 0, firstname: "No hay datos", realname: "", puesto: "" },
              ];
              this.isLoad = true;
              this.disabled = true;
            }
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    } else {
      this.usuarios = [
        {
          id: 0,
          firstname: " Debes seleccionar una empresa",
          realname: "",
          puesto: "",
        },
      ];
      this.isLoad = true;
      this.disabled = true;
    }
  }

  /**
   * Construcción del formulario
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSolicitudCompra = this.formBuilder.group({
        empresa: new FormControl("", Validators.required),
        usuario_destino: new FormControl(""),
        c_c: new FormControl(0),
        motivo: new FormControl(null, Validators.required),
      });
      this.formDetalleSolicitud = this.formBuilder.group({
        cantidad: new FormControl(null, Validators.required),
        cat_unidades_medida_id: new FormControl("", Validators.required),
        descripcion: new FormControl(null, [Validators.required]),
        observaciones: new FormControl(null, []),
        img_referencia: new FormControl(null),
        cat_areas: new FormControl(""),
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

  /**
   * Guarda el contenido del la solicitud y detalles
   * @returns
   */
  public save() {
    this.submitted = true;
    this.isLoad = true;

    if (this.formSolicitudCompra.invalid) {
      this.isLoad = false;

      this.alertasService.mostrarAlerta(
        "Alerta",
        "Debes llenar correctamente todos los campos",
        "warning",
        "warning"
      );

      return;
    }

    /**
     * Valido que el usuario ingrese por lo menos un detalle
     */
    if (this.tableData.length === 0) {
      this.isLoad = false;

      this.alertasService.mostrarAlerta(
        "Alerta",
        "Agrega por lo menos un elemento a la solicitud",
        "warning",
        "warning"
      );

      return;
    }

    const data = {
      ...this.formSolicitudCompra.value,
      usuario_solicita: this.usuarioSolicita.id,
      detalles: this.tableData,
    };

    if(!this.isAgencia){
      data.c_c = 0;
    }
    
    if (this.isAgencia) {
      data.usuario_destino = this.usuarioSolicita.id;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));

    //agrega los detalles al form data para enviarlos
    this.tableData.forEach((detalle, index) => {
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

          this.alertasService.mostrarAlerta(
            "Guardado",
            "Solicitud registrada correctamente",
            "success",
            "success"
          );

          this.cerrarModal();
        } else {
          this.alertasService.mostrarAlerta("Error", response.message, "warning", "warning");

          return;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error", error, "warning", "warning");
      }
    );

    this.tableData = [];
    this.submitted = false;
    this.formSolicitudCompra.reset();
  }

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

  /**
   * Funciones detalle solicitud
   */
  get detalleSolicitudFormControl() {
    return this.formDetalleSolicitud.controls;
  }

  /**
   * método que obtiene el texto del select unidad
   * @param selectElement eventos del select
   */
  public onChange(selectElement: any) {
    const selectedText =
      selectElement.options[selectElement.selectedIndex].text;
    this.unidad = selectedText;
  }

  /**
   * Función que captura el archivo en el input
   * @param event evento capturado del input
   * @param fieldName nombre del campo
   */
  onFileChange(event: any, fieldName: string) {
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
    // cat_areas: "",
  };

  /**
   *  Agrega los detalles a el array detalle para después mostrarlo en la tabla
   */
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
      // cat_areas: (this.centrosCostos[this.formSolicitudCompra.value.c_c-1].Clave)
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

  /**
   * elimina el detalle del array detalles
   */
  public removeDetalle(index: number) {
    this.tableData.splice(index, 1);
  }

  /**
   * Cuenta los caracteres restantes de text area motivo
   */
  // public contarCaracteres() {
  //   this.caracteresRestantes = this.longitudMaxima - this.text.length;
  // }

  /**
   * Recupera el catalogo de unidades
   */
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

  mostrarErrores(errores: any, mensaje: any) {
    let mensajes = "";
    for (let campo in errores) {
      mensajes += `${errores[campo].join(", ")} \n`;
    }

    Swal.fire({
      icon: "error",
      title: mensaje,
      text: mensajes,
      customClass: {
        popup: "text-start",
      },
    });
  }
}
