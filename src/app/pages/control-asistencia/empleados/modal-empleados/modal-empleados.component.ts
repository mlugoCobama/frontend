import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { EmpleadosService } from 'src/app/core/services/control-asistencia/empleados.service';
import { EmpresasService } from 'src/app/core/services/ucoip/empresas.service';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-modal-empleados',
  templateUrl: './modal-empleados.component.html',
  styleUrl: './modal-empleados.component.css'
})
export class ModalEmpleadosComponent {

  public event: EventEmitter<any> = new EventEmitter();
  public submitted = false;
  public sending = false;
  public myForm!: FormGroup;
  public datos:any = [];
  public tipo: any = '';
  public intercompania: any;
  private company_id: any;
  private device_id: any;

  
    constructor(
      public modalRef: BsModalRef,
      private fb: FormBuilder,
      private alerta : SwalComprsServiceService,
      private empleadosService: EmpleadosService
    ) {}
  
    ngOnInit(): void {
      
      this.buildForm();
      
      if(this.tipo == 'actualizar'){
        console.log("actulizando");
        
        this.patchFormValues();
        
        console.log(this.myForm);
        
        
      }

    }
  
    private buildForm(){
      
      this.myForm = this.fb.group({
        id: [null],
        pin: ['', [Validators.required]],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
      });

    }
  
    get f() {
      return this.myForm.controls;
    }
  
    patchFormValues() {
      
      this.myForm.patchValue({
        id: this.datos?.id,
        pin: this.datos?.pin,
        first_name: this.datos?.first_name,
        last_name: this.datos?.last_name
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
      const data = { company_id : this.company_id, device_id: this.device_id, employees: [ form ]}

      if (this.tipo == 'actualizar') {

        this.empleadosService.update(form, this.datos?.id).subscribe(
          (response) => {
            if (response.success === true) {
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
    
      } else {

        this.empleadosService.postEmpleados(data).subscribe(
        (response) => {
          if (response.success === true) {
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
