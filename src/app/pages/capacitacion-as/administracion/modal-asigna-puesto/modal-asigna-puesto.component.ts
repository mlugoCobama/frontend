import { AfterViewInit, Component,  EventEmitter,  ViewChild, Input } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AdministracionService } from 'src/app/core/services/capacitaciones/administracion.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

@Component({
  selector: "app-modal-asigna-puesto",
  templateUrl: "./modal-asigna-puesto.component.html",
  styleUrl: "./modal-asigna-puesto.component.css",
})
export class ModalAsignaPuestoComponent {
  public event: EventEmitter<any> = new EventEmitter();

  public isLoading: boolean = true;
  public isLoad: boolean = true;
  public disabled: boolean = false;
  public submitted: boolean = false;
  public sending: boolean = false;

  public formAsignarPuesto: FormGroup;

  public empresas = [];
  public puestos = [];
  public usuarios = [];
  public datos : any;
  public tipo = '';


  constructor(
    public modalRef: BsModalRef,
    public formBuilder: FormBuilder,
    public administracion: AdministracionService,
    public alerta: SwalComprsServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if(this.tipo === "Actualizar"){
      this.llenarForm();
    }
  }

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }
  /**
   * Construcción del formulario
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formAsignarPuesto = this.formBuilder.group({
        id: new FormControl(null),
        empresa: new FormControl("", Validators.required),
        usuario: new FormControl("", Validators.required),
        puesto: new FormControl("", Validators.required),
      });
      resolve(true);
    });
  }
  /**
   * Funciones form solicitud
   */
  get asignarPuestoFormControl() {
    return this.formAsignarPuesto.controls;
  }

  /**
   * Recupera los usuarios que pertenecen a las empresas (Select usuario)
   * @param intercompania num de intercompania
   */
  public getUsuarios(intercompania: any) {
    this.usuarios = [];
    this.isLoad = false;
    this.disabled = false;
    // this.isAgencia = this.interAgencias.some((num) => num === Number(intercompania));
    if (intercompania != "") {
      this.administracion.getUsuariosEmpresas(intercompania).subscribe(
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
   * Recupera los Valores del formulario
   */
  obtenerValores() {
    return this.formAsignarPuesto.value;
  }
  /**
   * Verifica que el fomulario sea valido
   */
  esValido() {
    return this.formAsignarPuesto.valid;
  }

  /**
   * Reinicia el formulario de solicitud compra
   */
  resetearFormulario() {
    return this.formAsignarPuesto.reset();
  }

  /**
   * guardar
   */
  public guardar() {
    if (!this.esValido()) {
      this.submitted = true;
      this.alerta.mostrarAlerta(
        "Error",
        "Debes de llenar todos los campos",
        "warning",
        "warning"
      );
      return;
    }

    const data = this.obtenerValores();

    this.administracion.save(data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.event.emit(true);
          this.alerta.mostrarAlerta(
            "Guardado",
            response.message,
            "success",
            "success"
          );
          // this.event.emit(false);
          this.cerrarModal();
          this.sending = false;
        } else {
          this.alerta.mostrarAlerta(
            "Error",
            response.message,
            "error",
            "danger"
          );
          this.sending = false;
        }
      },
      (error) => {
        this.alerta.mostrarAlerta(
          "Error",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
        this.sending = false;
      }
    );
  }

  public llenarForm(){
    this.formAsignarPuesto.patchValue({
      id: this.datos.id,
      empresa: this.datos.intercompania,
      usuario: this.datos.id_usuario,
      puesto: this.datos.id_puesto,
    });

    this.getUsuarios(this.datos.intercompania);

    this.formAsignarPuesto.patchValue({
      usuario: this.datos.id_usuario,
    });
  }
}
