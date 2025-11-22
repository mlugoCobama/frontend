import { AfterViewInit, Component, Input } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { EstadoSolicitud } from "../../estado-solicitud.enum";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

@Component({
  selector: "app-form-datos-entrega-oc",
  templateUrl: "./form-datos-entrega-oc.component.html",
  styleUrl: "./form-datos-entrega-oc.component.css",
})
export class FormDatosEntregaOcComponent implements AfterViewInit {
  public formOrdenCompra: FormGroup;
  public enEsts = EstadoSolicitud;
  public empresas: any = [];
  public isLoading: boolean = true;

  @Input() mostrarObs: any = [];
  @Input() solicitudCompra: any = {};
  @Input() tipo: any = null;
  @Input() datos: any = [];

  public modosPago = [
    { id: 1, descripcion: "Contado" },
    { id: 2, descripcion: "Credito" },
  ];

  ngAfterViewInit(): void {
    this.getEmpresas();
    this.buildForm();
    console.log(this.solicitudCompra)
  }

  constructor(
    public formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService
  ) {}

  /**
   * construye el formulario
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formOrdenCompra = this.formBuilder.group({
        id: new FormControl(null),
        entrega: new FormControl("", Validators.required),
        modoPago: new FormControl("", Validators.required),
        observaciones: new FormControl(null),
      });
      resolve(true);
    });
  }

  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }

  public getFormValues(){
    if(!this.isValid()){
      this.alertasService.mostrarAlerta("Error", "Entrega y modo de pago son obligatorios", "error", "danger");
      return;
    }
    return this.formOrdenCompra.value;
  }

  public isValid(){
    this.formOrdenCompra.markAllAsTouched();
    return this.formOrdenCompra.valid;
  }

  public llenarForm(){
    this.formOrdenCompra.patchValue({
      id: this.datos?.id,
      entrega: this.datos?.entrega,
      modoPago: this.datos?.modoPago,
      observaciones: this.datos?.observaciones,
    });
  }

  public getEmpresas() {
    if (this.solicitudCompra.estatus <= this.enEsts.Autorizado && this.solicitudCompra.estatus != this.enEsts.Cancelado) {
      this.usuariosService.getEmpresas().subscribe(
        (response) => {
          if (response) {
            const rawData = response.data;
            if (this.tipo != null) {
              /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
              this.empresas = rawData.filter(
                (objeto) => objeto.isAgencia === false
              );
            } else {
              this.empresas = rawData;
            }
            this.isLoading = false;
          } else {
            this.alertasService.mostrarAlerta("Error",response.message,"error","danger"
            );
          }
        },
        (error) => {
          this.alertasService.mostrarAlerta("Error", error, "error", "danger");
        }
      );
    }
  }
}
