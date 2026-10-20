import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import dataMeses from "src/environments/meses.json";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-reporte',
  templateUrl: './modal-reporte.component.html',
  styleUrl: './modal-reporte.component.css'
})
export class ModalReporteComponent {
  
  public event: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public sending = false;
  public myForm!: FormGroup;
  public datos:any = [];
  public tipo: any = '';
  public intercompania: any;
  public meses = dataMeses; //datos del select mes
  public opcionesAnios: any;
  
  private url: any;
  
  
  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
  ) {}


  
  ngOnInit(): void {
    this.buildForm();

    const anioActual = new Date().getFullYear();
    // Generar opciones de años dinámicamente (por ejemplo: actual y 4 anteriores)
    this.opcionesAnios = Array.from({ length: 3 }, (_, i) => anioActual - i);
    
  }
  
  private buildForm(){
    
    this.myForm = this.fb.group({
      quincena: ['', [Validators.required]],
      mes: ['', Validators.required],
      anio: ['', Validators.required],
    });

  }
  
  get f() {
    return this.myForm.controls;
  }
  
  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

  public download(){

    const form =  this.myForm.value;
   
    if (form.quincena == 'Q3') {
      const periodo = form.anio + "-" + form.mes;
      this.url = environment.apiBiometricosUrl + 'v1/companies/intercompania/' + this.intercompania + '/reports/monthly/csv?period=' + periodo; 
    } else {
      const periodo = form.anio + "-" + form.mes + "-" + form.quincena;     
      this.url =  environment.apiBiometricosUrl + 'v1/companies/intercompania/' + this.intercompania + '/reports/quincenal/csv?period=' + periodo;
    }  

    window.location.href = this.url;
    
  }

  softResetForm(){
    this.sending = false;
    this.myForm.patchValue({
      id: null,
      pin: '',
      first_name: '',
      last_name: ''
    });
  }
  
  mostrarAlerta() {
      Swal.fire({
        title: 'Empleado dado de alta Correctamente',
        text: '¿Quieres agregar otro?',
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
