import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { ComprasService } from "src/app/core/services/compras/compras.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { ComprasMacroService } from "src/app/core/services/compras/compras-macro.service";
import { PermisosService } from "src/app/core/services/permisos.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-btn-autorizacion-gerencia",
  templateUrl: "./btn-autorizacion-gerencia.component.html",
  styleUrl: "./btn-autorizacion-gerencia.component.css",
})
export class BtnAutorizacionGerenciaComponent {
  @Input() tipoAutorizacion: any;
  @Input() solicitudCompra: any;
  @Output() actualizarStatus = new EventEmitter<void>();

  constructor(
    public comprasService: ComprasService,
    private alertasService: SwalComprsServiceService,
    private localStorage: LocalStorageServiceService,
    private usuariosService: UsuariosService,
    private comprasMacro: ComprasMacroService,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    this.getUsuarioActivo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes != null && this.solicitudCompra.estatus === 1) {
      this.enviarSolicitud();
    }
  }

  tienePermiso(permiso: string = null): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

  public usuarioActivo: any;
  public puesto: any;

  public isGG: boolean = true;
  public isGA: boolean = true;
  public isMacro: boolean = false;

  public autorizar(gerencia) {
    if (this.solicitudCompra.estatus === 1) {
      this.autorizarSolicitud(gerencia);
    } else if (this.solicitudCompra.estatus === 3) {
      this.autorizarCotizacion(gerencia);
    }
  }

  public autorizarSolicitud(gerencia) {
    const data = { campo: gerencia, value: 1 };
    this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Listo!",
            "Autorización Notificada",
            "success",
            "success"
          );
          this.actualizarStatus.emit();
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            "Hubo un error",
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error!",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  public autorizarCotizacion(gerencia) {
    const data = { campo: gerencia, value: 1 };
    this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alertasService.mostrarAlerta(
            "Listo!",
            "Autorización Notificada",
            "success",
            "success"
          );
          this.enviarSolicitud();
          this.actualizarStatus.emit();
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            "Hubo un error",
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error!",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  public enviarSolicitud() {
    const auto_admin = this.solicitudCompra.auto_admin;
    const auto_gral = this.solicitudCompra.auto_gg;
    const tipo_solicitud = this.solicitudCompra.tipo;
    const auto_macro = this.solicitudCompra.auto_macro;
    const data = { campo: "estatus", value: 2 };
    if (auto_admin === 1 && auto_gral === 1 && (tipo_solicitud === 1 || tipo_solicitud === 3)) {
      this.actualizarDatos(data);
    }
    if (
      auto_admin === 1 &&
      auto_gral === 1 &&
      tipo_solicitud === 2 &&
      auto_macro === 1
    ) {
      this.actualizarDatos(data);
    }
  }

  public actualizarDatos(data) {
    this.comprasService.edit(this.solicitudCompra.id, data).subscribe(
      (response) => {
        if (response.status === "success") {
          //console.log("Se envía notificación al departamento de compras")
          this.actualizarStatus.emit();
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            "Hubo un error",
            "error",
            "danger"
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error!",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  /**
   * Recupera el usuario activo en el local storage
   */
  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      (response) => {
        if (response.status === "success") {
          this.usuarioActivo = response.data[0];

          this.validarGerencia(response.data[0]);
        } else {
          this.alertasService.mostrarAlerta(
            response.message,
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );
          return;
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta(
          "Error!",
          `Error fetching data: ${error}`,
          "error",
          "danger"
        );
      }
    );
  }

  public validarGerencia(usuario: any) {
    const puesto = usuario.puesto;
    // const patrones = ["Gerente General", "Gerente Administrativo"]
    const patron = "Gerente General";
    const posicion = puesto.indexOf(patron);
    const patron2 = "Gerente Administrativo";
    const posicion2 = puesto.indexOf(patron2);
    const patron3 = "Jefe de Taller";
    const posicion3 = puesto.indexOf(patron3);
    if (posicion !== -1) {
      this.isGA = true;
    }
    if (posicion2 !== -1) {
      this.isGG = true;
    }
    if (posicion3 !== -1) {
      this.isMacro = true;
    }
  }

  public guardar(gerencia) {
    const id = this.solicitudCompra.id;
    const datos = this.comprasMacro.obtenerDatosActuales();

    if (datos.sistema === "" || datos.tipoMantenimiento === "" || !datos) {
      this.alertasService.mostrarAlerta(
        "Faltan datos",
        "Debes llenar ambos campos",
        "warning",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "La solicitud sera autorizada y enviada a compras",
      text: "Por favor ingresa tus observaciones, información o consideraciones que deba de conocer el area de compras para continuar con el proceso de solicitud",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      icon: "info",
      confirmButtonText: "Sí, autorizar",
      showCancelButton: true,
      cancelButtonText: "No",
      customClass: {
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-primary ms-2 px-4",
      },
      buttonsStyling: false,
      preConfirm: (razon) => {
        if (!razon || razon.trim() === '') {
                Swal.showValidationMessage('Debes agregar tus observaciones acerca de la solicitud para el area de compras');
                return false;
              }
              return razon;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          ...datos,
          observacion: result.value,
        };
        this.comprasMacro.edit(id, payload).subscribe(
          (response) => {
            if ((response.status = "success")) {
              this.enviarSolicitud();
              this.alertasService.mostrarAlerta(
                "Listo",
                response.message,
                "success",
                "success"
              );
            }
          },
          (error) => {
            this.alertasService.mostrarAlerta(
              "Listo",
              error,
              "success",
              "success"
            );
          }
        );
      }
    });
  }
}
