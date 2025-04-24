import { Component, Input, OnInit, EventEmitter } from "@angular/core";
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";

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

  // public text: string = "";
  // public longitudMaxima: number = 150;
  // public caracteresRestantes: number = this.longitudMaxima;

  public unidades: any;
  public unidad: any;
  public detalles: any;
  public empresas: any;
  public usuarios: any;
  public usuarioSolicita: any;

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
    /** ****************************************************************************
     * !------------------------------IMPORTANTE------------------------------------
     * TODO cambiar esta linea para que recupere el usuario activo en base al correo
     *******************************************************************************/
    this.usuariosService.getUserById(usuarioActivo['role']['email']).subscribe(
    // this.usuariosService.getUserById("mlugo@cobama.com.mx").subscribe(
      (response) => {
        if (response.status === 'success') {
          this.usuarioSolicita = response.data;
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
   * Recupera los usuarios que pertenecen a las empresas (Select usuario)
   * @param intercompania num de intercompania
   */
  public getUsuarios(intercompania: any) {
    this.usuarios = [];
    this.isLoad = false;
    this.disabled = false;
    if(intercompania != ""){
      this.usuariosService.getUsuariosEmpresas(intercompania).subscribe(
        (response) => {
          if (response) {
            if(response.data.length > 0 ){
              this.usuarios = response.data;
              this.isLoad = true;
            }else{
              this.usuarios = [{id: 0, firstname: "No hay datos", realname: "",  puesto: '' }]
              this.isLoad = true;
              this.disabled =  true;
            }
            
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    }else{
        this.usuarios = [{id: 0, firstname: " Debes seleccionar una empresa", realname: "",  puesto: '' }]
        this.isLoad = true;
        this.disabled =  true;
    }
    
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
          // Validators.maxLength(150),
        ]),
        observaciones: new FormControl(null, [
          // Validators.required,
          // Validators.maxLength(45),
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

  /**
   * Guarda el contenido del la solicitud y detalles
   * @returns 
   */
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

    /**
     * Valido que el usuario ingrese por lo menos un detalle
     */ 
    if (this.tableData.length === 0) {
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
      ...this.formSolicitudCompra.value,
      users_id: "1",
      usuario_solicita: this.usuarioSolicita.id,
      detalles: this.tableData,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(data));

    //agrega los detalles al form data para enviarlos
    this.tableData.forEach((detalle, index) => {
      if (detalle.img_referencia) {
        formDataToSend.append(`img_referencia_${index}`, detalle.img_referencia);
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

          // Swal.fire({
          //   title: "Error",
          //   text: "Hubo un error al guardar la solicitud",
          //   buttonsStyling: false,
          //   icon: "warning",
          //   customClass: {
          //     confirmButton: "btn btn-warning px-4",
          //     cancelButton: "btn btn- ms-2 px-4",
          //   },
          // });
          // console.log(response.message);
          this.mostrarErrores(response.message);
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
    };

    if (this.formData.has("img_referencia")) {
      newDetalle.img_referencia1 = URL.createObjectURL(this.formData.get("img_referencia") as Blob);
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

  mostrarErrores(errores: any){
    let mensajes = '';
    for (let campo in errores){
      mensajes += `${errores[campo].join(', ')}\n`
    }

    Swal.fire({
      icon: 'error',
      title: 'Errores de validacion',
      text: mensajes,
    customClass:{
     popup : 'text-start'
    }
      })
  }
}
