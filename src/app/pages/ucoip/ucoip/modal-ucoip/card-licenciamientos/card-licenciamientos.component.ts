import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import { AsingLicenciamientosUcoipService } from 'src/app/core/services/ucoip/asing-licenciamientos-ucoip.service';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { ResguardosService } from 'src/app/core/services/ucoip/resguardos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-licenciamientos',
  templateUrl: './card-licenciamientos.component.html',
  styleUrl: './card-licenciamientos.component.css'
})
export class CardLicenciamientosComponent  implements OnInit{

  @Input() ucoip:any;
  @Input() glpi:any;

  @Output() actualizarAsignados = new EventEmitter<any>();
  form!: FormGroup;

  public isLoad:boolean = true;
  public removing:boolean = false;
  public mostrarFormulario:boolean = false;
  public loading:boolean = false;

  datos:any = [];
  hardwareFiltrado: any[] = [];
  idsSeleccionados: number[] = [];
  data = [];
    
  

  constructor(private fb: FormBuilder, 
    private software: AsingLicenciamientosUcoipService,
    private resguardos: ResguardosService
  ) {}

  ngOnInit(): void {

    this.getSwDisponible();
    this.getSwAsignado();
    this.buildForm();

    this.form.get('tipoSoftware')?.valueChanges.subscribe(tipoId => {
      const seleccionado = this.datos.find((d:any) => d.id === +tipoId);
      this.hardwareFiltrado = seleccionado ? seleccionado.licencias_disponible : [];
      this.form.get('software')?.reset();
    });
  }

  public buildForm(){
    this.form = this.fb.group({
        tipoSoftware: [null, [Validators.required]],
        software: [null, Validators.required]
      });
  }

  get f() {
    return this.form.controls;
  }

  asignar() {
    if (!this.form.valid) {
          Swal.fire({
            icon: "warning",
            title: "Error",
            text: "Falta informacion Importante: "+ obtenerPrimerError(this.form) ,
          });
          this.loading = false;
          this.form.markAllAsTouched();
          return;
        }
        
        const payload = {idUcoip: this.ucoip?.id ?? null , ...this.ucoip, ...this.form.value};

      this.software.save(payload).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Activos asignados correctamente'
          });
          this.form.reset();
          this.getSwDisponible();
         this.getSwAsignado();
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
        this.software.remove(id).subscribe({
          next: (res) => {
            this.removing = false;
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: res.message || 'Activo removido correctamente'
            });
            this.getSwDisponible();
            this.getSwAsignado();
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


  public getSwDisponible(){
    this.datos = [];

    this.software.getSoftwareDisponible(this.ucoip?.cat_empresa_id).subscribe({
      next: async (resp) => {
        if (resp.status = 'success') {
          this.datos = resp.data;
        }
      },
      error: (err) => {
        console.error('Error cargando módulos', err);
      }
    });
  }

  public getSwAsignado(){
    this.isLoad = true;
    this.data = [];
    this.software.getUcoipLicencias(this.ucoip?.id).subscribe({
      next: async (resp) => {
        if (resp.status = 'success') {
          this.isLoad = false;
          this.data = resp.data;
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

