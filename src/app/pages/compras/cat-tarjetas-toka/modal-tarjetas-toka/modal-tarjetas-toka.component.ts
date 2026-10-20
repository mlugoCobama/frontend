import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TokaService } from 'src/app/core/services/compras/toka.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-modal-tarjetas-toka',
  templateUrl: './modal-tarjetas-toka.component.html',
  styleUrl: './modal-tarjetas-toka.component.css'
})
export class ModalTarjetasTokaComponent implements OnInit{

   public event: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public sending = false;
  myForm!: FormGroup;
  clientesToka = [];
  public data:any = [];
  tipo: any = '';

  customPatterns = { 
    '0': { pattern: new RegExp('[0-9*]') },
  };

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private toka: TokaService,
    private alerta : SwalComprsServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if(this.tipo == 'actualizar'){
      this.patchFormValues();
      console.log(this.data)
    }
  }

  private buildForm(){
    this.myForm = this.fb.group({
      id: [null],
      empresa: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^[\d*]{16}$/)]],
      proxyNumber: ['', Validators.required],
      cuenta: ['', Validators.required],
      nomina: ['', Validators.required]
    });
  }

  get f() {
    return this.myForm.controls;
  }

  patchFormValues() {
    
  this.myForm.patchValue({
      id: this.data?.id,
      empresa: this.data?.empresa_id,
      numeroTarjeta: this.data?.tarjeta,
      proxyNumber: this.data?.proxy_number,
      cuenta: this.data?.cuenta,
      nomina: this.data?.nomina
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
    const context = { tipo : this.tipo}
    const payload = { ...form, ...context}

    this.toka.save(payload).subscribe(
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
      // empresa: '',
      numeroTarjeta: '',
      proxyNumber: '',
      cuenta: '',
      nomina: ''
    });
  }

mostrarAlerta() {
    Swal.fire({
      title: 'Tarjeta Guardada Correctamente',
      text: '¿Quieres agregar otra tarjeta?',
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
