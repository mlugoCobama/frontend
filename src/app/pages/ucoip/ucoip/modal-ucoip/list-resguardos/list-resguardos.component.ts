import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { ResguardosService } from 'src/app/core/services/ucoip/resguardos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-resguardos',
  templateUrl: './list-resguardos.component.html',
  styleUrl: './list-resguardos.component.css'
})
export class ListResguardosComponent implements OnInit{
  @Input() data = [];

  @Input() ucoip:any;
  @Input() ucoip2:any;
  @Input() glpi:any;

  @Output() actualizarAsignados = new EventEmitter<any>();
  form!: FormGroup;

  public mostrarFormulario:boolean = false;
  public downloading:boolean = false;
  public removing:boolean = false;
  public loading:boolean = false;

  datos:any = [];
  hardwareFiltrado: any[] = [];
  idsSeleccionados: number[] = [];

  constructor(private fb: FormBuilder, 
    private catHardware: CatHardwareService,
    private resguardos: ResguardosService
  ) {}

  ngOnInit(): void {

    this.getHwDisponible();
    this.buildForm();
    this.form.get('tipoHardware')?.valueChanges.subscribe(tipoId => {
      const seleccionado = this.datos.find((d:any) => d.id === +tipoId);
      this.hardwareFiltrado = seleccionado ? seleccionado.hardware_disponible : [];
      this.form.get('hardware')?.reset();
    });
  }

  public buildForm(){
    this.form = this.fb.group({
      tipoHardware: ['', Validators.required],
      hardware: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }


  asignar() {
    this.loading = true;
    if(!this.form.valid){
      Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: "Falta informacion Importante "+ obtenerPrimerError(this.form)
          });
      this.form.markAllAsTouched();
      this.loading = false;
      return;
    }

    const payload = {...this.ucoip, ...this.form.value};
    
      this.resguardos.save(payload).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Activos asignados correctamente'
          });
          this.form.reset();
          this.getHwDisponible();
          this.actualizarAsignados.emit();
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
        this.resguardos.remove(id).subscribe({
          next: (res) => {
            this.removing = false;
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: res.message || 'Activo removido correctamente'
            });
            this.getHwDisponible();
            this.actualizarAsignados.emit();
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


  public getHwDisponible(){
    this.datos = [];
    this.catHardware.getHardwareDisponible(this.ucoip2?.cat_empresa_id).subscribe({
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

  public imprimirResguardo() {
    const payload = {
      idSleccionados: this.idsSeleccionados
    };

    this.downloading = true;

    this.resguardos.print(this.ucoip.id, payload).subscribe({
      next: (response: any) => {

        this.downloading = false;

        const blob = new Blob(
          [response.body],
          { type: 'application/pdf' }
        );

        const fileName =
          response.headers.get('X-Filename') ||
          'Resguardo.pdf';

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },

      error: () => {
        this.downloading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo generar el PDF'
        });
      }
    });
  }

}
