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
import { CatSistemasAutoService } from "src/app/core/services/macrotaller/cat-sistemas-auto.service";

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

  public fechaActual : any;
  public fechaFormateada: any;

  public modosPago = [
    { id: 1, descripcion: "Contado" },
    { id: 2, descripcion: "Credito" },
  ];

  ngAfterViewInit(): void {
    this.getEmpresas();
    this.getCategorias();
    this.buildForm();
    // console.log(this.solicitudCompra)
  }

  constructor(
    public formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService,
    private CatSistemasAuto: CatSistemasAutoService
  ) {}

  /**
   * construye el formulario
   */
  private buildForm() {
    this.fechaActual = new Date();
    this.fechaFormateada = this.fechaActual.toISOString().split('T')[0];

    return new Promise((resolve, reject) => {
      this.formOrdenCompra = this.formBuilder.group({
        id: new FormControl(null),
        entrega: new FormControl("", Validators.required),
        modoPago: new FormControl("", Validators.required),
        fechaEntrega : new FormControl (null, Validators.required),
        observaciones: new FormControl(null),
        categoria: new FormControl(""),
      });

      if (this.solicitudCompra?.tipo === 1 || this.solicitudCompra?.tipo === 4) {
        this.formOrdenCompra.get('categoria')?.setValidators([Validators.required]);
      } else {
        this.formOrdenCompra.get('categoria')?.clearValidators();
      }
      this.formOrdenCompra.get('categoria')?.updateValueAndValidity();

      resolve(true);
    });
  }

  get ordenCompraFormControl() {
    return this.formOrdenCompra.controls;
  }

  public getFormValues(){
    if(!this.isValid()){
      this.alertasService.mostrarAlerta("Error", "Entrega, modo de pago y fecha de entrega son obligatorios",
         "error", "danger");
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
      categoria: this.datos?.id_categoria,
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

  public isLoad:boolean = true;
  public sistemas: any = [];
  // public tiposMantenimiento: any = [];
  private getCategorias() {
    this.isLoad = true;
    this.CatSistemasAuto.getAll(this.solicitudCompra?.tipo).subscribe(
      (response) => {
        if (response) {
          this.sistemas = response.data;
          // console.log(this.sistemas);
          // this.tiposMantenimiento = response.data2;
          this.isLoad = false;
        } else {
          console.log(response.message);
          this.isLoad = false;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        this.isLoad = false;
      }
    );
  }
}
