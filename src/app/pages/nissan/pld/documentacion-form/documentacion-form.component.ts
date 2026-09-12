import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DocumentosServiceService, RespuestaGemini } from 'src/app/core/services/pld/documentos-service.service';

interface DocumentoItem {
  key: string;
  backendKey: string; // <-- Clave que espera el Request de Laravel
  label: string;
  descripcion: string;
  archivo: File | null;
  error: string | null;
}

@Component({
  selector: 'app-documentacion-form',
  templateUrl: './documentacion-form.component.html',
  styleUrl: './documentacion-form.component.css'
})
export class DocumentacionFormComponent implements OnInit {
  documentosForm!: FormGroup;

  @Output() datosRecuperados = new EventEmitter<any>();

  readonly maxFileSize = 5 * 1024 * 1024;
  readonly allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];

  // Control del estado de carga y respuestas
  cargando = false;
  respuestaBackend: RespuestaGemini | null = null;

  // Propiedades del modal cropper
  mostrarCropper = false;
  imageChangedEvent: Event | null = null;
  croppedImageBlob: Blob | null = null;
  itemEnEdicion: DocumentoItem | null = null;
  inputOriginal: HTMLInputElement | null = null;

  // Mapeo alineado con las reglas de validación de Laravel
  listaDocumentos: DocumentoItem[] = [
    { key: 'ineFrente', backendKey: 'ine', label: 'INE (Frente)', descripcion: 'Fotografía legible del INE.', archivo: null, error: null },
    { key: 'ineReverso', backendKey: 'ine_reverso', label: 'INE (Reverso)', descripcion: 'Fotografía del reverso del INE.', archivo: null, error: null },
    { key: 'constanciaFiscal', backendKey: 'csf', label: 'Constancia de Situación Fiscal', descripcion: 'Emisión no mayor a 3 meses.', archivo: null, error: null },
    { key: 'comprobanteDomicilio', backendKey: 'comprobante_domicilio', label: 'Comprobante de Domicilio', descripcion: 'Luz, agua o teléfono.', archivo: null, error: null },
    { key: 'curp', backendKey: 'curp', label: 'CURP', descripcion: 'Formato descargado de RENAPO.', archivo: null, error: null }
  ];

  constructor(
    private fb: FormBuilder,
    private documentosService: DocumentosServiceService // Inyección del servicio
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.documentosForm = this.fb.group({
      ineFrente: [null, [Validators.required]],
      ineReverso: [null],
      constanciaFiscal: [null, [Validators.required]],
      comprobanteDomicilio: [null, [Validators.required]],
      curp: [null, [Validators.required]]
    });
  }

  // --- Lógica del File Input y Cropper intacta ---
  onFileSelected(event: Event, item: DocumentoItem): void {
    const input = event.target as HTMLInputElement;
    item.error = null;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!this.allowedTypes.includes(file.type)) {
        item.error = 'Formato no permitido. Solo PDF, PNG o JPG.';
        this.limpiarControl(item.key);
        return;
      }

      if (file.size > this.maxFileSize) {
        item.error = 'El archivo supera el tamaño máximo permitido (5 MB).';
        this.limpiarControl(item.key);
        return;
      }

      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        this.itemEnEdicion = item;
        this.inputOriginal = input;
        this.imageChangedEvent = event;
        this.mostrarCropper = true;
      } else {
        this.asignarArchivo(item, file);
      }
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedImageBlob = event.blob;
    }
  }

  confirmarRecorte(): void {
    if (this.croppedImageBlob && this.itemEnEdicion) {
      const nombreOriginal = this.inputOriginal?.files?.[0]?.name || 'documento.png';

      const fileRecortado = new File([this.croppedImageBlob], nombreOriginal, {
        type: 'image/png',
        lastModified: Date.now()
      });

      if (fileRecortado.size > this.maxFileSize) {
        this.itemEnEdicion.error = 'La imagen recortada supera los 5 MB.';
        this.cancelarRecorte();
        return;
      }

      this.asignarArchivo(this.itemEnEdicion, fileRecortado);
    }
    this.cerrarModal();
  }

  cancelarRecorte(): void {
    if (this.inputOriginal) {
      this.inputOriginal.value = '';
    }
    this.cerrarModal();
  }

  private cerrarModal(): void {
    this.mostrarCropper = false;
    this.imageChangedEvent = null;
    this.croppedImageBlob = null;
    this.itemEnEdicion = null;
    this.inputOriginal = null;
  }

  private asignarArchivo(item: DocumentoItem, file: File): void {
    item.archivo = file;
    this.documentosForm.get(item.key)?.setValue(file);
    this.documentosForm.get(item.key)?.markAsTouched();
  }

  eliminarArchivo(item: DocumentoItem, inputHtml: HTMLInputElement): void {
    item.archivo = null;
    item.error = null;
    if (inputHtml) {
      inputHtml.value = '';
    }
    this.limpiarControl(item.key);
  }

  private limpiarControl(key: string): void {
    const control = this.documentosForm.get(key);
    control?.setValue(null);
    control?.markAsTouched();
  }

  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- ENVÍO AL BACKEND ---
  guardarDocumentos(): void {
    if (this.documentosForm.invalid) {
      this.documentosForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.respuestaBackend = null;
    const formData = new FormData();

    // Construir FormData usando los nombres que espera Laravel (backendKey)
    this.listaDocumentos.forEach(item => {
      const file = this.documentosForm.get(item.key)?.value;
      if (file instanceof File) {
        formData.append(item.backendKey, file, file.name);
      }
    });

    this.documentosService.procesar(formData).subscribe({
      next: (res) => {
        this.cargando = false;
        this.respuestaBackend = res;

        // Limpiar errores previos visuales si todo fue correcto
        this.listaDocumentos.forEach(doc => doc.error = null);

        // Si Laravel devolvió errores en documentos específicos:
        if (res.errors) {
          Object.keys(res.errors).forEach(backendKey => {
            const item = this.listaDocumentos.find(d => d.backendKey === backendKey);
            if (item) {
              item.error = res.errors[backendKey];
            }
          });
        }

        this.datosRecuperados.emit(res.data)

        console.log('Datos extraídos por Gemini:', res.data);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al comunicarse con el servidor:', err);
        alert('Ocurrió un error al procesar los documentos. Por favor intenta de nuevo.');
      }
    });
  }
}
