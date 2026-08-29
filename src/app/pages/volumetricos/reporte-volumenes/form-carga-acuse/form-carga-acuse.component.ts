import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { VisorVolumetricosService } from 'src/app/core/services/volumetricos/visor-volumetricos.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

export type TipoAcuse = 'entrega' | 'aceptacion';

@Component({
  selector: 'app-form-carga-acuse',
  templateUrl: './form-carga-acuse.component.html',
  styleUrl: './form-carga-acuse.component.css'
})
export class FormCargaAcuseComponent {

  @Input() tipo: TipoAcuse = 'entrega';
  @Input() registro:any;
  @Output() guardado = new EventEmitter<any>();

  @Output() error = new EventEmitter<any>();

  tipoAcuse: string = '';

  archivo: File | null = null;

  guardando = false;

  constructor(
    private acusesService: VisorVolumetricosService,
    private alertaService: SwalComprsServiceService
  ) {}

  get requiereTipoAcuse(): boolean {
    return this.tipo === 'aceptacion';
  }

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.archivo = null;
      return;
    }
    const archivo = input.files[0];
    // Validar PDF
    if (archivo.type !== 'application/pdf') {
      alert('El acuse debe estar en formato PDF.');
      input.value = '';
      this.archivo = null;
      return;
    }

    this.archivo = archivo;
  }

  guardarAcuse(): void {
    console.log(this.registro)
    // Evitar doble envío
    if (this.guardando) {
      return;
    }

    // Validar archivo
    if (!this.archivo) {
      alert('Debes seleccionar un archivo.');
      return;
    }

    // Validar tipo cuando corresponda
    if (this.requiereTipoAcuse && !this.tipoAcuse) {
      alert('Debes seleccionar el tipo de acuse.');
      return;
    }

    this.guardando = true;

    const formData = new FormData();

    formData.append('archivo', this.archivo);

    formData.append(
      'tipo', this.requiereTipoAcuse? this.tipoAcuse: 'entrega'
    );

    formData.append('reporte_id', this.registro.id)


    this.acusesService.storeAcuse(formData)
      .pipe(finalize(() => { this.guardando = false; }))
      .subscribe({
        next: (response) => {
          this.archivo = null;
          this.tipoAcuse = '';
          this.alertaService.mostrarAlerta('Listo!', 'Documento Guardado correctamente', 'success', 'success');
          this.guardado.emit(response);
        },
        error: (err) => {
          console.error('Error al guardar el acuse:', err);
          this.error.emit(err);
        }
      });
  }
}
