import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

//services
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

import catCentrosCostos from "src/environments/cat_centros_costos.json";
import { obtenerErroresFormulario } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: 'app-form-solicitud',
  templateUrl: './form-solicitud.component.html',
  styleUrl: './form-solicitud.component.css'
})
export class FormSolicitudComponent implements OnInit{

  public isLoading: boolean = true;
  public submittedDetail: boolean = false;
  public isLoad: boolean = false;
  public showTable: boolean = false;
  
  public disabled: boolean = false;
  public isAgencia: boolean = false;

  public formSolicitudCompra: FormGroup;
  public centrosCostos = catCentrosCostos;
  public usuarios:any = [];
  public empresas:any = [];

  public usuarioSolicita: any = {
    id: null,
    firstname: "",
    realname: "",
    name: "",
    puesto: "",
    Telfono: "",
    direccion: "",
    intercompania: 0,
    empresa: "Cargando. . .",
    isAgencia: false
    };

  public interAgencias = [
    7102, 7075, 7074, 7072, 7071, 7064, 7063, 7062, 7061, 7051, 712, 710, 706,
  ];

  public tiposCompras = [
    {tipoCompra: 'Compras Generales Gaseras', claveNum : 1 },
    {tipoCompra: 'Compras Infraestructura / Soporte / TI ', claveNum : 3},
    {tipoCompra: 'Compras Generales Autos', claveNum : 4},
  ];

  @Input() datos: any;
  @Input() submitted: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    public formBuilder: FormBuilder,
    private localStorage: LocalStorageServiceService,
    private usuariosService: UsuariosService,
    private alertasService: SwalComprsServiceService,

  ){}

  ngOnInit(): void {
    this.getEmpresas();
    
    this.buildForm();
    
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
        requiere_anticipo: new FormControl(null, Validators.required),
        // tipo: new FormControl(""),
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
   * Recupera el usuario activo en el local storage
   */
  // public getUsuarioActivo() {
  //   const usuarioActivo = this.localStorage.getItem("currentUser");

  //   this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
  //     (response) => {
  //       if (response.status === "success") {
  //         this.usuarioSolicita = response.data[0];
  //         if(this.usuarioSolicita.empresas !=  null){
  //           this.filtrarEmpresas( this.empresas ,this.usuarioSolicita.empresas);
  //         }
  //         this.getUsuarios(this.usuarioSolicita.intercompania);
  //         this.formSolicitudCompra.patchValue({empresa :  this.usuarioSolicita.intercompania});
  //         // console.log(this.usuarioSolicita);

  //       } else {
  //         this.alertasService.mostrarAlerta(
  //           response.message,
  //           "Intente iniciar sesión nuevamente",
  //           "warning",
  //           "warning"
  //         );

  //         // this.cerrarModal();
  //         this.closeModal.emit();
  //         return;
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching data:", error);
  //     }
  //   );
  // }

  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");
    this.usuarioSolicita = usuarioActivo["usuarioActivo"][0];
    if(this.usuarioSolicita){
      if (this.usuarioSolicita.empresas != null) {
      this.filtrarEmpresas(this.empresas, this.usuarioSolicita.empresas);
    }
    this.getUsuarios(this.usuarioSolicita.intercompania);
    this.formSolicitudCompra.patchValue({empresa :  this.usuarioSolicita.intercompania});
    }else{
      this.alertasService.mostrarAlerta(
            'error',
            "Intente iniciar sesión nuevamente",
            "warning",
            "warning"
          );
      this.closeModal.emit();
      return;
    }
    
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
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          
          this.empresas = response.data;
          this.getUsuarioActivo();
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

  filtrarEmpresas(data, empRel){
    this.empresas = data.filter(empresa =>
                empRel.includes(empresa.intercompania)
  );
  }

  /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario ->
   * { empresa, usuario_destino, c_c, motivo, orden_trabajo }
   */
  obtenerValores() {
    return this.formSolicitudCompra.value;
  }

  /**
   * Recupera el valor de usuario solicita
   * @returns int: id -> usuario solicita 
   */
  obtenerUsuarios() {
    return this.usuarioSolicita.id;
  }

  /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    return this.formSolicitudCompra.valid;
  }

  /**
   * Reinicia el formulario de solicitud compra
   * @returns true
   */
  resetearFormulario() {
    return this.formSolicitudCompra.reset();
  }

  /**
   * Recupera el valor de isAgencia para validar si el usuario o solicitud pertenece a una agencia
   * @returns recupera un true o un false
   */
  getIsAgencia(){
    return this.isAgencia;
  }

  mostrarErroresFormulario() {
  const errores = obtenerErroresFormulario(this.formSolicitudCompra);

  if (errores.length > 0) {
    return errores[0]; // o mostrar todos
  }
}

public setValues() {
  if(this.usuarioSolicita.intercompania != this.datos?.intercompania){
    this.getUsuarios(this.datos?.intercompania);
  }
  
  const valores = {
    empresa: this.datos?.intercompania,
    usuario_destino: this.datos?.usuario_destino_id,
    c_c: this.datos?.c_c,
    motivo: this.datos?.motivo,
    requiere_anticipo: this.datos?.requiere_anticipo == 1 ? "true" : "false"
  };

  this.formSolicitudCompra.patchValue(valores);

  this.formSolicitudCompra.get('usuario_destino')?.disable();
  this.formSolicitudCompra.get('empresa')?.disable();
}



}
