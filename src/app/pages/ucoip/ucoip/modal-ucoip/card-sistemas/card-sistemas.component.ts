import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { AsingSistemasUcoipService } from 'src/app/core/services/ucoip/asing-sistemas-ucoip.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-sistemas',
  templateUrl: './card-sistemas.component.html',
  styleUrl: './card-sistemas.component.css'
})
export class CardSistemasComponent implements OnInit{
  // @Input() data = [];
  @Input() ucoip:any;
  @Input() glpi:any;
  @Output() actualizarAsignados = new EventEmitter<any>();
  form!: FormGroup;

  mostrarFormulario = false;
  datos:any = [];

  hardwareFiltrado: any[] = [];

  @Input() catSistemas: any[] = [];

  constructor(private fb: FormBuilder, 
    private catHardware: CatHardwareService,
    private asignacion: AsingSistemasUcoipService
  ) {}

  ngOnInit(): void {

    this.getSistemas();
    this.form = this.fb.group({
      sistema: [null],
      usuario: [''],
      password: [''],
      observaciones: ['']
    });
  }

  public loading:boolean = false;
  asignar() {
    const payload = {idUcoip: this.ucoip?.id, ...this.ucoip, ...this.form.value};
    this.loading = true;
      this.asignacion.save(payload).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Activos asignados correctamente'
          });
          this.getSistemas();
        },
        error: () => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron asignar los activos'
          });
        }
      });
  }

  public removing:boolean = false;
  remover(id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción removerá el activo seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.removing = true;
        this.asignacion.remove(id).subscribe({
          next: (res) => {
            this.removing = false;
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: res.message || 'Activo removido correctamente'
            });
            this.getSistemas();
          },
          error: () => {
            this.removing = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo remover el activo'
            });
          }
        });
      }
    });
  }

  public isLoad:boolean =  true;
  public getSistemas(){
    this.isLoad = true;
    this.datos = [];
    this.asignacion.getUcoipResguardos(this.ucoip?.id).subscribe({
      next: async (resp) => {
        if (resp.status == 'success') {
          this.datos = resp.data;
          this.isLoad = false;
        }else{
          this.isLoad = false;
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  idsSeleccionados: number[] = [];

  toggleSeleccion(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.idsSeleccionados.push(id);
    } else {
      this.idsSeleccionados = this.idsSeleccionados.filter(
        item => item !== id
      );
    }
  }

  // public downloading:boolean = false;
  // public imprimirResguardo() {
  //   const payload = {
  //     idSleccionados: this.idsSeleccionados
  //   };

  //   this.downloading = true;

  //   this.asignacion.print(this.ucoip.id, payload).subscribe({
  //     next: (response: any) => {

  //       this.downloading = false;

  //       const blob = new Blob(
  //         [response.body],
  //         { type: 'application/pdf' }
  //       );

  //       const fileName =
  //         response.headers.get('X-Filename') ||
  //         'Resguardo.pdf';

  //       const url = window.URL.createObjectURL(blob);

  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = fileName;

  //       document.body.appendChild(link);
  //       link.click();

  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     },

  //     error: () => {

  //       this.downloading = false;

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'No se pudo generar el PDF'
  //       });
  //     }
  //   });
  // }

    loadingPass: boolean = false;

    public openPass(id:any){
      this.loadingPass = true;
      this.asignacion.getPasswordUcoip(id)
      // .pipe(take(1))
        .subscribe({
          next: (resp) => {
            if(resp.success){
              Swal.fire({
                title: 'Contraseña',
                text: resp.data,
                icon: 'info',
                timer: 15000,          
                timerProgressBar: true, 
                showConfirmButton: false 
              });
            }
            this.loadingPass = false;
          },
          error: (err) => {
            console.log(err);
            this.loadingPass = false;
          }
        });
    }

}