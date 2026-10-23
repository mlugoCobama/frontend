import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TokaService } from 'src/app/core/services/compras/toka.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2';
import { CatGastosPredefinidosService } from 'src/app/core/services/nissan/cat-gastos-predefinidos.service';

@Component({
  selector: 'app-modal-gastos-predefinidos',
  templateUrl: './modal-gastos-predefinidos.component.html',
  styleUrl: './modal-gastos-predefinidos.component.css'
})
export class ModalGastosPredefinidosComponent {
  public event: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public sending = false;
  myForm!: FormGroup;
  clientesToka = [];
  public data:any = [];
  tipo: any = '';

  agencias = [
    { value: '710',   name: 'Nissan Universidad' },
    { value: '730',   name: 'Nissan Azcapotzalco'},
    { value: '714',   name: 'Nissan Campestre'},
    { value: '1',     name: 'Renault Azcapotzalco'},
    { value: '2',     name: 'Renault Ecatepec'},
    { value: '3',     name: 'Renault Vallejo'},
    { value: '4',     name: 'Renault Pachuca'},
  ];

  tiposVehiculos = [
    { value: 'NU',   name: 'Nuevos' },
    { value: 'US',   name: 'Seminuevos'},
  ];

  catGastos = ['gasolina','previa','traslados','cortesia','placas',];



  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private toka: TokaService,
    private alerta : SwalComprsServiceService,
    private catGastosService :CatGastosPredefinidosService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if(this.tipo == 'actualizar'){
      this.patchFormValues();
    }
  }

  private buildForm(){
    this.myForm = this.fb.group({
      id: [null],
      clave_gasto: ['', Validators.required],
      agencia: ['', Validators.required],
      tipo_vehiculo: ['', Validators.required],
      importe: ['', Validators.required],
    });
  }

  get f() {
    return this.myForm.controls;
  }

  patchFormValues() {

  this.myForm.patchValue({
      id: this.data?.id,
      clave_gasto: this.data?.clave_gasto,
      agencia: this.data?.agencia_id,
      tipo_vehiculo: this.data?.tipo_vehiculo,
      importe: this.data?.importe
    });
  }



  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

  public save(){
    this.sending =  true;
    if(!this.myForm.valid){
      this.alerta.mostrarAlerta("Error",'formulario invalido', "warning", "warning");
      this.myForm.markAllAsTouched();
      this.sending = false;
      return
    }

    const form =  this.myForm.value;
    // const context = { tipo : this.tipo}
    // const payload = { ...form, ...context}

    this.catGastosService.store(form).subscribe(
      (response) => {
        if (response.status === "success") {
          this.alerta.mostrarAlerta("Guardado", "Solicitud registrada correctamente","success","success");
          this.mostrarAlerta();
          this.sending = false;
        } else {
          this.alerta.mostrarAlerta("Error", response.message, "warning", "warning");
          this.sending = false;
          return;
        }
      },
      (error) => {
        this.alerta.mostrarAlerta("Error", error, "warning", "warning");
        this.sending = false;
        return;
      }
    );
  }

  softResetForm(){
    this.sending = false;
    this.myForm.patchValue({
      id: null,
      clave_gasto: '',
      agencia: '',
      tipo_vehiculo: '',
      importe: 0
    });
  }

mostrarAlerta() {
    Swal.fire({
      title: 'Guardado correctamente',
      text: '¿Quieres guardar otro gasto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
         this.softResetForm();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
         this.event.emit();
        this.cerrarModal();
      }
    });
  }
}
