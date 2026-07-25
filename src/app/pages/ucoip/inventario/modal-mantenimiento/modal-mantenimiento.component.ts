import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { PreventivoFormComponent } from '../preventivo-form/preventivo-form.component';
import { CorrectivoFormComponent } from '../correctivo-form/correctivo-form.component';
import { EvidenciaUploaderComponent } from '../evidencia-uploader/evidencia-uploader.component';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';

@Component({
  selector: 'app-modal-mantenimiento',
  templateUrl: './modal-mantenimiento.component.html',
  styleUrls: ['./modal-mantenimiento.component.css']
})
export class ModalMantenimientoComponent implements OnInit {

  form!: FormGroup;
  tipo = '';
  data: any;
  saving = false;
  event = new EventEmitter<any>();

  evidenciaAntes: File[] = [];
  evidenciaDespues: File[] = [];

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    private almacenService: AlmacenService
  ) {}

  ngOnInit(): void {
    this.getTecnicos();
    this.tipo = this.data?.tipo ?? 'agregar';
    this.buildForm();

    if (this.data?.hardware_id) {
      this.form.patchValue({ hardware_id: this.data.hardware_id });
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      hardware_id: [null, Validators.required],
      tipo: ['preventivo', Validators.required],
      fecha: [this.fechaHoy(), Validators.required],
      realizado_por: ['', Validators.required],
      duracion: [null],

      preventivo: this.fb.group({
        limpieza_externa: [false],
        limpieza_interna: [false],
        limpieza_ventiladores: [false],
        limpieza_disipadores: [false],
        limpieza_fuente: [false],
        pasta_termica: [false],
        revision_ram: [false],
        revision_disco: [false],
        revision_conexiones: [false],
        revision_cables: [false],
        revision_usb: [false],
        revision_red: [false],
        revision_teclado: [false],
        revision_mouse: [false],
        revision_monitor: [false],
        actualizacion_so: [false],
        actualizacion_drivers: [false],
        actualizacion_antivirus: [false],
        limpieza_temporales: [false],
        optimizacion: [false],
        comentarios: [''],
        observaciones: ['']
      }),

      correctivo: this.fb.group({
        falla: [''],
        diagnostico: [''],
        reinstalacion_so: [false],
        instalacion_drivers: [false],
        configuracion: [false],
        pruebas: [false],
        piezas: this.fb.array([]),
        comentarios: [''],
        observaciones: ['']
      })
    });
  }

  get preventivoGroup(): FormGroup {
    return this.form.get('preventivo') as FormGroup;
  }

  get correctivoGroup(): FormGroup {
    return this.form.get('correctivo') as FormGroup;
  }

  fechaHoy(): string {
    return new Date().toISOString().substring(0, 10);
  }

  onEvidenciaAntes(files: File[]): void {
    this.evidenciaAntes = files;
  }

  onEvidenciaDespues(files: File[]): void {
    this.evidenciaDespues = files;
  }

  cerrarModal(): void {
    this.modalRef.hide();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    // Se arma FormData para poder enviar también las imágenes de evidencia,
    // que antes se guardaban en memoria pero nunca se emitían.
    const payload = new FormData();
    payload.append('data', JSON.stringify(this.form.value));
    this.evidenciaAntes.forEach(f => payload.append('evidencia_antes[]', f, f.name));
    this.evidenciaDespues.forEach(f => payload.append('evidencia_despues[]', f, f.name));

    this.event.emit(payload);
    this.modalRef.hide();
  }

  update(): void {
    this.save();
  }

  public tecnicos:any = []
  private getTecnicos() {
    // this.isLoad = true;
    this.almacenService.getTecnicosTi().subscribe(
      (response) => {
        if (response) {
          this.tecnicos = response.data;
          // this.isLoad = false;
        } else {
          console.log("Error",response.message,"error","danger");
          // this.isLoad = false;
          }
        },
        (error) => {
          console.log("Error",`Error fetching data: ${error}`,"error","danger");
          // this.isLoad = false;
        }
    );
  }
}