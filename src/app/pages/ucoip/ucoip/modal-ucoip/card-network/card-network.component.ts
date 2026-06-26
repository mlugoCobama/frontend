import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { AsingRecursoUcoipService } from 'src/app/core/services/ucoip/asing-recurso-ucoip.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-network',
  templateUrl: './card-network.component.html',
  styleUrl: './card-network.component.css'
})
export class CardNetworkComponent implements OnInit{
  @Input() data = [];
  @Input() ucoip:any;
  @Input() glpi:any;

  @Output() actualizarAsignados = new EventEmitter<any>();
  form!: FormGroup;

  mostrarFormulario = false;
  datos:any = [];

  hardwareFiltrado: any[] = [];

  @Input() catRecursosRed: any[] = [];

  constructor(private fb: FormBuilder, 
    private catHardware: CatHardwareService,
    private asignacion: AsingRecursoUcoipService
  ) {}

  ngOnInit(): void {

    this.getRecursosUcoip();
    this.form = this.fb.group({
      tipo: [null],
      valor: [null],
      hardware: [null],
      restrictivo: [null],
      observaciones: [null]
    });
  }

  public loading:boolean = false;
  asignar() {
    const payload = {idUcoip : this.ucoip.id, ...this.ucoip, ...this.form.value};
    this.loading = true;
      this.asignacion.save(payload).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Activos asignados correctamente'
          });
          this.getRecursosUcoip();
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
            this.getRecursosUcoip();
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
  public getRecursosUcoip(){
    this.isLoad = true;

    this.datos = [];
    this.asignacion.getUcoipResguardos(this.ucoip?.id).subscribe({
      next: async (resp) => {
        if (resp.status = 'success') {
          this.datos = resp.data;
          this.isLoad = false;
        }else{
          this.isLoad = false;
        }
      },
      error: (err) => {
        this.isLoad = false;
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

}