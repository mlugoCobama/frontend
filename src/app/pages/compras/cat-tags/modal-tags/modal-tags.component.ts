import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { TokaService } from 'src/app/core/services/compras/tag.service';
import { TagService } from 'src/app/core/services/compras/tag.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-modal-tags',
  templateUrl: './modal-tags.component.html',
  styleUrl: './modal-tags.component.css'
})
export class ModalTagsComponent implements OnInit{

  public event: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public sending = false;
  tagForm!: FormGroup;
  empresas = [];
  clientesToka = [];
  public data:any = [];
  tipo: any = '';

  customPatterns = { 
    '0': { pattern: new RegExp('[0-9*]') },
  };

  public marcasTag: any = [
    {marca: 1, label: 'PASE'},
    {marca: 2, label: 'IAVE'},
    {marca: 3, label: 'TeleVia'},
    {marca: 4, label: 'ViaPass'},
    {marca: 5, label: 'EasyTrip'},
    {marca: 5, label: 'Otro'},

  ]

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private tag: TagService,
    private alerta : SwalComprsServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if(this.tipo == 'actualizar'){
      this.patchFormValues();
    }
  }

  private buildForm(){
    this.tagForm = this.fb.group({
        id: [null],
        proveedor: ['', Validators.required],
        num_tag: ['', Validators.required],
        // numero_cuenta: ['', Validators.required],
        serie: ['', Validators.required],
        // fecha_alta: ['', Validators.required],
        // fecha_vencimiento: ['', Validators.required],
        estatus: ['', Validators.required],
        observaciones: [''],
        intercompania: ['', Validators.required],
    });
  }

  get f() {
    return this.tagForm.controls;
  }

  patchFormValues() {
  this.tagForm.patchValue({
    id: this.data?.id,
    proveedor: this.data?.proveedor,
    num_tag: this.data?.num_tag,
    numero_cuenta: this.data?.numero_cuenta,
    serie: this.data?.serie,
    fecha_alta: this.data?.fecha_alta,
    fecha_vencimiento: this.data?.fecha_venciemiento,
    estatus: +this.data?.esatus,
    observaciones: this.data?.observaciones,
    intercompania: this.data?.intercompania,
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
    if(!this.tagForm.valid){
      this.alerta.mostrarAlerta("Error",'formulario invalido', "warning", "warning");
      this.tagForm.markAllAsTouched();
      this.sending = false;
      return
    }

    const form =  this.tagForm.value;
    const context = { tipo : this.tipo}
    const payload = { ...form, ...context}

    this.tag.save(payload).subscribe(
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
    this.tagForm.patchValue({
      id: null,
      proveedor: '',
      num_tag: '',
      numero_cuenta: '',
      serie: '',
      fecha_alta: '',
      fecha_vencimiento: '',
      estatus: '',
      observaciones: '',
      // intercompania: this.data?.intercompania,
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