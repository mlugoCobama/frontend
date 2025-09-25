import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { MacroService } from 'src/app/core/services/macrotaller/macro.service';

@Component({
  selector: 'app-form-entrada-almacen',
  templateUrl: './form-entrada-almacen.component.html',
  styleUrl: './form-entrada-almacen.component.css'
})
export class FormEntradaAlmacenComponent implements OnInit{

  @Output() enviarDatos = new EventEmitter<any>();
  @Input() submitted: boolean = false;
  
  public formEntrada: FormGroup;
  public gaseras: any = []; 
  public compras: any = [];
  public referencias: any = [];
  public detalles: any = [];
  public finding : boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public macro:  MacroService,
  ){}

  ngOnInit(): void {
    this.buildForm();
    this.getGaseras();  
    this.disableFields();
  }

  public tiposBusqueda : any = [
    {id:  1, tipo:'Orden de trabajo', key:'orden_trabajo'},
    {id:  2, tipo:'Folio Requisición', key:'folio_requisicion'},
    {id:  3, tipo:'Orden Compra', key:'folio_oc'},
    {id:  4, tipo:'Solicitud Compra', key:'folio_sc'}
  ];

  private buildForm() {
    return new Promise((resolve, reject) => {
      this.formEntrada = this.formBuilder.group({
        empresa: new FormControl("", Validators.required),
        tipo: new FormControl("", Validators.required),
        referencia: new FormControl("", Validators.required),
        });
        resolve(true);
      });
    }

    get entradaFormControl() {
    return this.formEntrada.controls;
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
   * Método que recupera las compras que tienen detalles en almacén
   */
  public getCompras(intercompania){
    this.finding = true;

    this.resetFields();
    this.disableFields();

    this.enviarDatos.emit(this.detalles);
    this.macro.getCompras(intercompania).subscribe((response)=>{
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
    if (this.compras.length > 0 && parametro != "" ) {
      this.referencias = this.compras.map(compra => ({id : compra.id , label : compra[parametro]}));
    }
  }

  /**
   * Método que recupera los detalles sin existencia en el almacén
   */
  public buscarDetalles(idSolicitud){
    this.detalles = [];
    this.macro.getDetalleEntrada(idSolicitud).subscribe((response)=>{
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
   * Deshabilita los campos de tipo y referencia
   */
  private disableFields(){
    this.entradaFormControl.tipo.disable();
    this.entradaFormControl.referencia.disable();
  }

  /**
   * Habilita los campos de tipo y referencia
   */
  private enableFields(){
    this.entradaFormControl.tipo.enable();
    this.entradaFormControl.referencia.enable();
  }

  /**
   * Resetea los campos de tipo y referencia
   */
  private resetFields(){
    this.referencias = [];
    this.entradaFormControl.tipo.reset("");
    this.entradaFormControl.referencia.reset("");
  }
}
