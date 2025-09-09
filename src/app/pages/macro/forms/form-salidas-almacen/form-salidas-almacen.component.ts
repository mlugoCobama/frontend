import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MacroService } from 'src/app/core/services/macrotaller/macro.service';

@Component({
  selector: 'app-form-salidas-almacen',
  templateUrl: './form-salidas-almacen.component.html',
  styleUrl: './form-salidas-almacen.component.css'
})
export class FormSalidasAlmacenComponent implements OnInit{

  @Output() enviarDatos = new EventEmitter<any>();
  @Input() submitted: boolean = false;

  public gaseras: any = []; 
  public tecnicos: any = []; 
  public compras: any = [];
  public referencias: any = [];
  public detalles: any = [];
  public formSalida: FormGroup;
  public finding : boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public macro:  MacroService,
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.getGaseras();
    this.getTecnicos(); 
    this.disableFields();
  }

  public tiposBusqueda : any = [
    {id:  1, tipo:'Orden de trabajo', key:'orden_trabajo'},
    {id:  2, tipo:'Autotanque', key:'nro_economico'},    
  ];

  /**
   * metodo que construye le formulario
   * @returns 
   */
  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formSalida = this.formBuilder.group({
        empresa: new FormControl("", Validators.required),
        tipo: new FormControl("", Validators.required),
        referencia: new FormControl("", Validators.required),
        tecnico: new FormControl("", Validators.required),
        });
        resolve(true);
      });
    }

  get salidaFormControl() {
    return this.formSalida.controls;
  }

  /**
   * Método que obtiene el listado de gaseras
   */
  private getGaseras(){
    this.macro.getGaseras().subscribe((response)=>{
      if(response.status){
        this.gaseras = response.data;
      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

  /**
   * Método que obtiene el listado de técnicos
   */
  private getTecnicos(){
    this.macro.getTecnicos().subscribe((response)=>{
      if(response.status){
        this.tecnicos = response.data;

      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

  /**
   * Método que recupera las compras que tienen detalles en almacén
   */
  public getCompras(intercompania){
    this.finding = true;

    this.resetFields();
    this.disableFields();
    
    this.enviarDatos.emit(this.detalles);
    this.macro.getComprasAlmacenadas(intercompania).subscribe((response)=>{
      if(response.status){
        this.compras = response.data;
        if(this.compras.length > 0){
          this.enableFields()
          this.finding = false;
        }
        this.finding = false;
        
      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

  /**
   * Método que llena el select de referencias
   */
  public setValues(parametro) {
    this.referencias = [];
    this.enviarDatos.emit(this.detalles);
    if(parametro === "nro_economico"){
      this.obtenerValores();
      const resultado = this.filtrarUnicos(this.compras, "nro_economico");
      this.mapearResultado( resultado, 'id_autotanque', 'nro_economico');
    }else{
      this.mapearResultado(this.compras, 'id', 'orden_trabajo');
    }
  }

  /**
   * Mapea los datos para llenar el select tipo
   * @param compras datos a procesar
   * @param pId parámetro de donde se obtiene el id
   * @param pLabel parámetro que sera la etiqueta que muestra el select
   */
  public mapearResultado( compras ,pId, pLabel){
    if (compras.length > 0 && pLabel != "" ) {
      this.referencias = compras.map(compra => ({id : compra[pId] ,  label : compra[pLabel]}));
    }
  }

  /**
   * Método que recupera los detalles con existencia en el almacén
   */
  public buscarDetalles(idSolicitud){
    this.detalles = [];
    const tipo = this.salidaFormControl.tipo.value;
    
    this.macro.getDetalleSalida(idSolicitud, tipo).subscribe((response)=>{
      if(response.status){
        // this.detalles = response.data;
        this.enviarDatos.emit(response.data);
      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

    /**
   * Recupera los Valores del formulario
   * @returns object: valores del formulario 
   */
  obtenerValores() {
    const value = this.formSalida.value;
    console.log(value);
    return value;
  }
  /**
   * Verifica que el fomulario sea valido
   * @returns boolean:  true ->valido, false ->no valido
   */
  esValido() {
    return this.formSalida.valid;
  }

  /**
   * Resetea el formulario formSolicitud compra
   */
  resetearFormulario() {
    this.formSalida.reset();
  }

  // funcion que filtra los datos para evitar duplicados
  filtrarUnicos<T>(array: T[], propiedad: keyof T): T[] {
  const vistos = new Set();
  return array.filter(item => {
    const valor = item[propiedad];
    if (vistos.has(valor)) return false;
    vistos.add(valor);
    return true;
  });
}

  /**
   * Deshabilita los campos de tipo y referencia
   */
  private disableFields(){
    this.salidaFormControl.tipo.disable();
    this.salidaFormControl.referencia.disable();
    this.salidaFormControl.tecnico.disable();
  }

  /**
   * Habilita los campos de tipo y referencia
   */
  private enableFields(){
    this.salidaFormControl.tipo.enable();
    this.salidaFormControl.referencia.enable();
    this.salidaFormControl.tecnico.enable();

  }

  /**
   * Resetea los campos de tipo y referencia
   */
  private resetFields(){
    this.referencias = [];
    this.salidaFormControl.tipo.reset("");
    this.salidaFormControl.referencia.reset("");
    this.salidaFormControl.tecnico.reset("");
  }


}
