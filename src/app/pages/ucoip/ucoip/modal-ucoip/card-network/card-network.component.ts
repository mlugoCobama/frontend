import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { AsingRecursoUcoipService } from 'src/app/core/services/ucoip/asing-recurso-ucoip.service';
import Swal from 'sweetalert2';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: 'app-card-network',
  templateUrl: './card-network.component.html',
  styleUrl: './card-network.component.css'
})
export class CardNetworkComponent implements OnInit{
  @Input() data = [];
  @Input() ucoip:any;
  @Input() glpi:any;
  @Input() catRecursosRed: any[] = [];

  @Output() actualizarAsignados = new EventEmitter<any>();

  public mostrarFormulario:boolean = false;
  public loading:boolean = false;
  public removing:boolean = false;
  public isLoad:boolean =  true;

  datos:any = [];
  hardwareFiltrado: any[] = [];
  idsSeleccionados: number[] = [];

  form!: FormGroup;

  constructor(private fb: FormBuilder, 
    private catHardware: CatHardwareService,
    private asignacion: AsingRecursoUcoipService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getRecursosUcoip();
    
  }

  public buildForm(){
    this.form = this.fb.group({
          tipo: [null, [Validators.required]],
          valor: [null, [ Validators.required]],
          hardware: [null],
          restrictivo: [null],
          observaciones: [null]
        });
  }

  get f() {
    return this.form.controls;
  }


  asignar() {
    this.loading = true;
    if (!this.form.valid) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Falta informacion Importante: " + obtenerPrimerError(this.form),
      });
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }
    const payload = {idUcoip : this.ucoip.id, ...this.ucoip, ...this.form.value};
      this.asignacion.save(payload).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Activos asignados correctamente'
          });
          this.getRecursosUcoip();
          this.form.reset();
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
}