import { AfterViewInit, Component,  EventEmitter,  ViewChild, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import Swal from 'sweetalert2';
import { TecnicosService } from 'src/app/core/services/macrotaller/tecnicos.service';


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

  public datos: any = [];
  public empresas: any = [];

  constructor(
    public modalRef: BsModalRef,
    public formBuilder: FormBuilder,
    private tecnicos  : TecnicosService
  ){}

  ngOnInit(): void {
    this.buildForm();
    if (this.tipo == "actualizar"){
      this.llenarForm();
    }
  }


  private buildForm() {
      return new Promise((resolve, reject) => {
        this.formDatosTecnico = this.formBuilder.group({
          id: new FormControl(  null  ),
          empresa: new FormControl("", Validators.required),
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
      this.formDatosTecnico.patchValue({
        id: this.datos.id ?? null,
        empresa: this.datos.intercompania,
        nombre: this.datos.nombre,
        apellidos: this.datos.apellidos,
        tipo: this.datos.tipo,
      });
    }

    /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.formDatosTecnico.reset();
    this.modalRef.hide();
    // setTimeout(() => { this.modalCerrado.emit() }, 150);
  }

  public save() {
          this.submitted = true;
          // this.event.emit(true);
  
          if (this.formDatosTecnico.invalid) {
            Swal.fire({
              title: "Alerta",
              text: "Debes llenar correctamente todos los campos",
              buttonsStyling: false,
              icon: "warning",
              customClass: {
                confirmButton: "btn btn-warning px-4",
                cancelButton: "btn btn- ms-2 px-4",
              },
            });
            this.event.emit(false);
            return;
          }
          const datos = this.formDatosTecnico.value;
          this.tecnicos.save(datos).subscribe(
            (response) => {
              if (response.status === "success") {
                this.event.emit(true);
                // this.modalCerrado.emit();
                Swal.fire({
                  title: "Guardado",
                  text: response.message,
                  buttonsStyling: false,
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-success px-4",
                    cancelButton: "btn btn- ms-2 px-4",
                  },
                });
                // this.event.emit(false);
              } else {
                console.log(response.message);
              }
            },
            (error) => {
              console.error("Error fetching data:", error);
            }
          );
      
          this.cerrarModal();
          this.submitted = false;
          this.formDatosTecnico.reset();
        }
}
