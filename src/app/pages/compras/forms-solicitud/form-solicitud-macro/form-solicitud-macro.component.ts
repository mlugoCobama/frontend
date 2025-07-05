import { Component, OnInit, Input } from '@angular/core';
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import {  FormBuilder, FormControl, FormGroup,  Validators  } from "@angular/forms";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';


@Component({
  selector: 'app-form-solicitud-macro',
  templateUrl: './form-solicitud-macro.component.html',
  styleUrl: './form-solicitud-macro.component.css'
})
export class FormSolicitudMacroComponent implements OnInit{

  public formSolicitudCompra: FormGroup;
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

  @Input() submitted: boolean;
  public isLoading: boolean = true;

  public empresas:any;
  public usuarios:any;
  public autotanques: any = [];

  public isLoad: boolean = false;
  public disabled: boolean = false;
  
  public interAgencias = [
    7102, 7075, 7074, 7072, 7071, 7064, 7063, 7062, 7061, 7051, 712, 710, 706,
  ];

  public isAgencia: boolean = false;

  constructor( 
    public formBuilder: FormBuilder,
    private localStorage: LocalStorageServiceService,
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService,
    private comprasMacro: ComprasMacroService,
   ){};

   ngOnInit(): void {
    this.getEmpresas();
    this.getUsuarioActivo();
    this.buildForm();
   }

   private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSolicitudCompra = this.formBuilder.group({
        empresa: new FormControl("", Validators.required),
        usuario_destino: new FormControl("", Validators.required),
        c_c: new FormControl(0),
        motivo: new FormControl(null, Validators.required),
        orden_trabajo: new FormControl(null, Validators.required),
      });
      resolve(true);
    });
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

  public get solicitudCompraFormControl() {
    return this.formSolicitudCompra.controls;
  }

  public getForm(): FormGroup {
    return this.formSolicitudCompra;
  }



    public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      (response) => {
        if (response.status === "success") {

          this.usuarioSolicita = response.data[0];
          this.getAutotanques(this.usuarioSolicita.intercompania);
          this.formSolicitudCompra.patchValue({empresa :  this.usuarioSolicita.intercompania});
          // console.log(this.usuarioSolicita);

        } else {
          this.alertasService.mostrarAlerta(
            response.message,
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );

          // this.cerrarModal();
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
   * @param intercompania num de intercompania: int
   */
  getAutotanques(intercompania){
    this.autotanques = [];
    this.isLoad = false;
    this.disabled = false;
    this.comprasMacro.getAutotanques(intercompania).subscribe(
      (response) => {

        if (response) {
          if(response.data.length > 0){
            this.autotanques = response.data;
            this.isLoad = true;
            this.isLoading = false;
          }else{
           this.autotanques = [
                { id: null, marca_vehiculo: "No hay datos", realname: "", puesto: "" },
              ];
              this.isLoad = true;
              this.disabled = true;
          }
          // this.autotanquesFormatted(this.autotanques)
          
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

    // Método para obtener los valores
  obtenerValores() {
    return this.formSolicitudCompra.value;
  }

  obtenerUsuarios() {
    return this.usuarioSolicita.id;
  }

  // Método para validar el formulario
  esValido() {
    return this.formSolicitudCompra.valid;
  }

  resetearFormulario() {
    return this.formSolicitudCompra.reset();
  }

public datosSelect: any;
public autotanquesFormatted(datos) {
  this.datosSelect = datos.map(item => ({
    value: item.id,
    label: `ECO: ${item.id} ${item.marca_vehiculo} ${item.submarca}(${item.modelo}) PLACAS: ${item.placas}`
  }));
}

}
