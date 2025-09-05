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

  public gaseras: any = []; 
  public tecnicos: any = []; 
  public compras: any = [];
  public referencias: any = [];
  public detalles: any = [];
  public formSalida: FormGroup;
  @Input() submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public macro:  MacroService,
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.getGaseras();
    this.getTecnicos(); 
  }

  public tiposBusqueda : any = [
    {id:  1, tipo:'Orden de trabajo', key:'orden_trabajo'},
    {id:  2, tipo:'Autotanque', key:'nro_economico'},
    // {id:  3, tipo:'Orden Compra', key:'folio_oc'},
    // {id:  4, tipo:'Solicitud Compra', key:'folio_sc'}
    
  ];

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

  private getTecnicos(){
    this.macro.getTecnicos().subscribe((response)=>{
      if(response.status){
        this.tecnicos = response.data;
        console.log(this.tecnicos)
      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

  public getCompras(intercompania){
    this.salidaFormControl.tipo.reset("");
    this.salidaFormControl.referencia.reset("");
    this.enviarDatos.emit(this.detalles);
    this.macro.getComprasAlmacenadas(intercompania).subscribe((response)=>{
      if(response.status){
        this.compras = response.data;
        
      }else{
        console.log(response.message);
      }
    },(error) => {
      console.error("Error fetching data:", error);
    })
  }

  public setValues(parametro) {
    this.referencias = [];
    this.enviarDatos.emit(this.detalles);
    if (this.compras.length > 0 && parametro != "" ) {
      this.referencias = this.compras.map(compra => ({id : compra.id ,  label : compra[parametro]}));
    }
  }

  public buscarDetalles(idSolicitud){
    this.detalles = [];
    this.macro.getDetalleSalida(idSolicitud).subscribe((response)=>{
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
}
