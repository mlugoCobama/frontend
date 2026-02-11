import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from "src/app/core/services/compras/usuarios.service";
import {  FormBuilder, FormControl, FormGroup,  Validators  } from "@angular/forms";
import { LocalStorageServiceService } from "src/app/core/services/local-storage-service.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";
import { ComprasMacroService } from 'src/app/core/services/compras/compras-macro.service';
import { obtenerErroresFormulario } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: 'app-form-solicitud-macro',
  templateUrl: './form-solicitud-macro.component.html',
  styleUrl: './form-solicitud-macro.component.css'
})
export class FormSolicitudMacroComponent implements OnInit{

  public formSolicitudCompra: FormGroup;
  public formData = new FormData();

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
    isAgencia: false,
    idVehiculo: null,
    };

  @Input() datos: any;
  @Input() submitted: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() setData = new EventEmitter<any>();
  @Output() setDestino = new EventEmitter<any>();

  public isLoading: boolean = true;

  public empresas:any = [];
  public usuarios:any = [];
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
        folio_requisicion: new FormControl(null, Validators.required),
        formato_orden_trabajo: new FormControl(null, Validators.required),
        cotizacion: new FormControl(null),
        requiere_anticipo: new FormControl(null, Validators.required)
      });
      resolve(true);
    });
  }

  public setValues() {
    this.formSolicitudCompra.get('formato_orden_trabajo')?.clearValidators();
    this.formSolicitudCompra.get('formato_orden_trabajo')?.updateValueAndValidity();


  if(this.usuarioSolicita.intercompania != this.datos?.intercompania){
    this.getAutotanques(this.datos?.intercompania);
  }
  const valores = {
    empresa: this.datos?.intercompania,
    usuario_destino: this.datos?.usuario_destino_id,
    c_c: this.datos?.c_c,
    motivo: this.datos?.motivo,
    orden_trabajo: this.datos?.orden_trabajo,
    folio_requisicion: this.datos?.folio_requisicion,
    formato_orden_trabajo: this.datos?.formato_orden_trabajo,
    requiere_anticipo: this.datos?.requiere_anticipo == 1 ? "true" : "false"
  };
  this.formSolicitudCompra.patchValue(valores);
  
  this.setDato(this.datos?.usuario_destino_id);
  this.formSolicitudCompra.get('usuario_destino')?.disable();
  this.formSolicitudCompra.get('empresa')?.disable();
  this.formSolicitudCompra.get('formato_orden_trabajo')?.disable();
  this.formSolicitudCompra.get('cotizacion')?.disable();
}

  public get solicitudCompraFormControl() {
    return this.formSolicitudCompra.controls;
  }
  /**
   * Recupera el catalogo de empresas (Select empresa)
   */
  public getEmpresas() {
    this.usuariosService.getEmpresas().subscribe(
      (response) => {
        if (response) {
          const rawData = response.data
          /**Filtro para solo mostrar las empresas que tienen acceso a macrotaller */
          this.empresas = rawData.filter(objeto => objeto.isAgencia === false);
          
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



  public getForm(): FormGroup {
    return this.formSolicitudCompra;
  }

  public getUsuarioActivo() {
    const usuarioActivo = this.localStorage.getItem("currentUser");

    this.usuariosService.getUserById(usuarioActivo["role"]["email"]).subscribe(
      (response) => {
        if (response.status === "success") {

          this.usuarioSolicita = response.data[0];
          if(this.usuarioSolicita.empresas !=  null){
            this.filtrarEmpresas( this.empresas ,this.usuarioSolicita.empresas);
          }
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
          this.closeModal.emit();
          // this.cerrarModal();
          return;
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  onFileChange(event: any, fieldName: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.set(fieldName, file);
    }else{
      this.formData.delete(fieldName);
    }
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
          this.setData.emit(this.autotanques);
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
    const value = this.formSolicitudCompra.value;
    return value;
  }

  obtenerArchivos() {
    
    return this.formData;
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
   * Resetea el formulario formSolicitud compra
   * @returns true
   */
  resetearFormulario() {
    this.formSolicitudCompra.reset();
    this.formData = new FormData();
  }

  setDato(dato){
    this.setDestino.emit(dato);
  }

public datosSelect: any;
/**
 * Formatea los datos apra llenar el ngselect   
 * @param datos array : debe contener
 * id o no_economico, marca_vehiculo, submarca, modelo, placas
 */
public autotanquesFormatted(datos) {
  this.datosSelect = datos.map(item => ({
    value: item.id,
    label: `ECO: ${item.id} ${item.marca_vehiculo} ${item.submarca}(${item.modelo}) PLACAS: ${item.placas}`
  }));
}

mostrarErroresFormulario() {
  const errores = obtenerErroresFormulario(this.formSolicitudCompra);

  if (errores.length > 0) {
    return errores[0]; // o mostrar todos
  }
}

}
