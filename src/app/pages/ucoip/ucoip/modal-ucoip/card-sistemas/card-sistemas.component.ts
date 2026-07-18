import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatHardwareService } from 'src/app/core/services/ucoip/cat-hardware.service';
import { AsingSistemasUcoipService } from 'src/app/core/services/ucoip/asing-sistemas-ucoip.service';
import Swal from 'sweetalert2';
import { obtenerPrimerError } from 'src/app/core/helpers/errores-forrmulario';

@Component({
  selector: "app-card-sistemas",
  templateUrl: "./card-sistemas.component.html",
  styleUrl: "./card-sistemas.component.css",
})
export class CardSistemasComponent implements OnInit {
  // @Input() data = [];
  @Input() ucoip: any;
  @Input() glpi: any;
  @Input() catSistemas: any[] = [];
  @Output() actualizarAsignados = new EventEmitter<any>();

  form!: FormGroup;

  public removing: boolean = false;
  public loading: boolean = false;
  public isLoad: boolean = true;
  public loadingPass: boolean = false;
  public mostrarFormulario: boolean = false;

  hardwareFiltrado: any[] = [];
  idsSeleccionados: number[] = [];
  datos: any = [];

  constructor(
    private fb: FormBuilder,
    private catHardware: CatHardwareService,
    private asignacion: AsingSistemasUcoipService,
  ) {}

  ngOnInit(): void {
    this.getSistemas();
    this.buildForm();
  }

  public buildForm() {
    this.form = this.fb.group({
      sistema: [null, [Validators.required]],
      usuario: ["", [Validators.required]],
      password: ["", [Validators.required]],
      observaciones: [""],
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
        text: "Falta informacion Importante: "+ obtenerPrimerError(this.form) ,
      });
      this.loading = false;
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      idUcoip: this.ucoip?.id,
      ...this.ucoip,
      ...this.form.value,
    };

    this.asignacion.save(payload).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: res.message || "Activos asignados correctamente",
        });
        this.getSistemas();
        this.form.reset();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron asignar los activos",
        });
      },
    });
  }

  remover(id: any) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción removerá el activo seleccionado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, remover",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.removing = true;
        this.asignacion.remove(id).subscribe({
          next: (res) => {
            this.removing = false;
            Swal.fire({
              icon: "success",
              title: "¡Éxito!",
              text: res.message || "Activo removido correctamente",
            });
            this.getSistemas();
          },
          error: () => {
            this.removing = false;
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo remover el activo",
            });
          },
        });
      }
    });
  }

  public getSistemas() {
    this.isLoad = true;
    this.datos = [];
    this.asignacion.getUcoipResguardos(this.ucoip?.id).subscribe({
      next: async (resp) => {
        if (resp.status == "success") {
          this.datos = resp.data;
          this.isLoad = false;
        } else {
          this.isLoad = false;
        }
      },
      error: (err) => {
        console.error("Error cargando módulos", err);
      },
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
        (item) => item !== id,
      );
    }
  }

  public openPass(id: any) {
    this.loadingPass = true;
    this.asignacion.getPasswordUcoip(id).subscribe({
      next: (resp) => {
        if (resp.success) {
          Swal.fire({
            title: "Contraseña",
            text: resp.data,
            icon: "info",
            timer: 15000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
        this.loadingPass = false;
      },
      error: (err) => {
        console.log(err);
        this.loadingPass = false;
      },
    });
  }
}