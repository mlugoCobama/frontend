import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlmacenService } from 'src/app/core/services/compras/almacen.service';
import { MantenimientoService } from 'src/app/core/services/ucoip/mantenimiento.service';

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

  // checklistItems:any = [];
  checklistCatalogo: any[] = [];
  loadingChecklist = false;

  checklistPreventivo: any[] = [];
  checklistCorrectivo: any[] = [];

  constructor(
    private fb: FormBuilder,
    public modalRef: BsModalRef,
    public modalService: BsModalService,
    private almacenService: AlmacenService,
    private mantenimientoService: MantenimientoService
  ) {}

  ngOnInit(): void {
    this.getTecnicos();
    this.tipo = this.data?.tipo ?? 'agregar';
    this.buildForm();

    if (this.data?.id) {
      this.form.patchValue({ hardware_id: this.data.id });
    }

    console.log(this.checklistCatalogo)
    this.construirChecklistCompleto();
  }

  buildForm(): void {
    this.form = this.fb.group({
      hardware_id: [null, Validators.required],
      tipo: ['1', Validators.required],
      fecha: [this.fechaHoy(), Validators.required],
      realizado_por: ['', Validators.required],
      checklist: this.fb.group({}),
      comentarios: [''],
      observaciones: [''],
      falla: ['', Validators.required],
      diagnostico: ['', Validators.required],
      piezas: this.fb.array([])
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

  const tipoActual = this.form.get('tipo')!.value;
  const itemsDelTipoActual = String(tipoActual) === '1'
    ? this.checklistPreventivo
    : this.checklistCorrectivo;

  const checklistPayload = itemsDelTipoActual.map((item: any) => ({
    cat_checklist_mantenimiento_id: item.id,
    completado: this.checklistFormGroup.get(item.codigo_control)?.value ? 1 : 0
  }));

  const payload = new FormData();
  payload.append('data', JSON.stringify({
    ...this.form.value,
    checklist: checklistPayload // sobreescribe el checklist crudo con el ya mapeado
  }));

  this.evidenciaAntes.forEach(f => payload.append('evidencia_antes[]', f, f.name));
  this.evidenciaDespues.forEach(f => payload.append('evidencia_despues[]', f, f.name));

  this.mantenimientoService.save(payload).subscribe({
    next: (response) => {
      this.saving = false;

      if (response.status === 'success') {
        this.event.emit(response.data);
        this.modalRef.hide();
      } else {
        console.log('Error', response.message ?? 'Algo salió mal', 'error', 'danger');
      }
    },
    error: (error) => {
      this.saving = false;
      console.log('Error', `Error al guardar: ${error?.error?.message ?? error}`, 'error', 'danger');
    }
  });
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

  get checklistFormGroup(): FormGroup {
      return this.form.get('checklist') as FormGroup;
    }

    private construirChecklistCompleto(): void {
    const checklistGroup = this.checklistFormGroup;
    console.log(this.checklistCatalogo);
    this.checklistCatalogo
      .filter((item: any) => item.activo === '1' || item.activo === 1 || item.activo === true)
      .forEach((item: any) => {
        const valorPrevio = this.data?.checklist?.[item.codigo_control] ?? false;
        checklistGroup.addControl(item.codigo_control, this.fb.control(valorPrevio));
      });
    this.checklistPreventivo = this.checklistCatalogo.filter(
      (item: any) => String(item.tipo) === '1'
    );
    this.checklistCorrectivo = this.checklistCatalogo.filter(
      (item: any) => String(item.tipo) === '2'
    );
  }

}
