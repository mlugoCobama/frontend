import { AfterViewInit, Component,  EventEmitter,  ViewChild, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-form-tecnico',
  templateUrl: './form-tecnico.component.html',
  styleUrl: './form-tecnico.component.css'
})
export class FormTecnicoComponent implements OnInit {

  public event: EventEmitter<any> = new EventEmitter();

  public formDatosTecnico: FormGroup;
  public tipo: string = ''; 
  public submitted = false;

  @Input() datos: any = [];
  

  constructor(
    public modalRef: BsModalRef,
    public formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.buildForm();
    if (this.tipo = "actualizar"){
      this.llenarForm();
    }
  }


  private buildForm() {
      return new Promise((resolve, reject) => {
        this.formDatosTecnico = this.formBuilder.group({
          id: new FormControl(  null  ),
          empresa: new FormControl( null, Validators.required),
          nombre: new FormControl(  null, Validators.required),
          apellidos: new FormControl( null, Validators.required),
          tipo: new FormControl(  null,[Validators.required]),
        });
        resolve(true);
      });
    }

  get datosTecnicoFormControl() {
    return this.formDatosTecnico.controls;
  }

    public llenarForm(){
      console.log(this.datos)
    this.formDatosTecnico.patchValue({
      id: this.datos.id ?? null,
      empresa: this.datos.empresa,
      nombre: this.datos.nombre,
      apellidos: this.datos.apellidos,
      tipo: this.datos.tipo,
    });
  }

    /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }
}
