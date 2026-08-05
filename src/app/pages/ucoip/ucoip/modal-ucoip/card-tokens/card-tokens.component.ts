import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AsingTokensUcoipService } from 'src/app/core/services/ucoip/asing-tokens-ucoip.service';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: 'app-card-tokens',
  templateUrl: './card-tokens.component.html',
  styleUrls: ['./card-tokens.component.css']
})
export class CardTokensComponent implements OnInit {

  @Input() ucoip: any;
  @Input() catSoftware: any[] = [];

  @Output() actualizarAsignados = new EventEmitter<any>();

  form!: FormGroup;

  datos: any[] = [];
  tokens: any[] = [];

  mostrarFormulario = false;

  isLoad = false;
  loading = false;
  removing = false;
  loadingPass = false;

  constructor(
    private fb: FormBuilder,
    private asignacion: AsingTokensUcoipService
  ) { }

  ngOnInit(): void {
    console.log(this.ucoip)
    this.buildForm();
    this.getAsignaciones();
    this.getTokensDisponibles();
  }

  public buildForm(){
    this.form = this.fb.group({
          token: ['', Validators.required],
          // usuario: ['', Validators.required],
          acceso: [''],
          contrasenia: ['', Validators.required]
        });
  }


  get f() {
    return this.form.controls;
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  getAsignaciones() {
    this.isLoad = true;
    this.asignacion.getUcoipTokens(this.ucoip.id).subscribe({
      next: resp => {
        this.isLoad = false;
        if(resp.status === 'success'){
          this.datos = resp.data;
        }
      },
      error: () => {
        this.isLoad = false;
      }
    });
  }

  getTokensDisponibles() {
    this.isLoad = true;
    this.asignacion.getTokensDisponibles(this.ucoip.cat_empresa_id).subscribe({
      next: resp => {
        this.isLoad = false;
        if(resp.status === 'success'){
          this.tokens = resp.data;
          console.log(resp.data)
        }
      },
      error: () => {
        this.isLoad = false;
      }
    });
  }

  asignar() {
    this.loading = true;
        if (!this.form.valid) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Falta informacion Importante: "+ obtenerPrimerError(this.form) ,
          });
          this.form.markAllAsTouched();
          this.loading = false;
          return;
        }

    const payload = {

      ucoip_ucoip_id: this.ucoip.id,
      usuario: this.ucoip.ucoip,
      ...this.form.value
    };

    this.asignacion.save(payload).subscribe({

      next: res => {

        this.loading = false;

        Swal.fire({

          icon:'success',

          title:'Éxito',

          text: res.message

        });

        this.form.reset({

          fecha_asignacion:new Date().toISOString().substring(0,10)

        });

        this.getAsignaciones();

      },

      error:()=>{

        this.loading=false;

        Swal.fire({

          icon:'error',

          title:'Error',

          text:'No fue posible guardar.'

        });

      }

    });

  }

  remover(id:number){

    Swal.fire({

      title:'¿Remover acceso?',

      icon:'warning',

      showCancelButton:true,

      confirmButtonText:'Sí'

    }).then(result=>{

      if(!result.isConfirmed) return;

      this.removing=true;

      this.asignacion.remove(id).subscribe({

        next:res=>{

          this.removing=false;

          Swal.fire({

            icon:'success',

            title:'Correcto',

            text:res.message

          });

          this.getAsignaciones();

        },

        error:()=>{

          this.removing=false;

        }

      });

    });

  }

  openPass(id:number, tipo:string){

    this.loadingPass=true;

    this.asignacion.getPasswordUcoip(id, tipo).subscribe({

      next:resp=>{

        this.loadingPass=false;

        if(resp.success){

          Swal.fire({

            title:'Contraseña',

            text:resp.data,

            icon:'info',

            timer:15000,

            timerProgressBar:true

          });

        }

      },

      error:()=>{

        this.loadingPass=false;

      }

    });

  }

}
