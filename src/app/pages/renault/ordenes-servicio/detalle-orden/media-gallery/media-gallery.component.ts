import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

export interface TestigoFotografico {
  id?: number;
  imagen: string;
  media_type: 'image' | 'video';
  categoria: 'entrada' | 'proceso' | string;
  descripcion?: string;
}

export interface StagedMedia {
  id: string; // ID temporal para trackBy
  file: File;
  previewUrl: string;
  media_type: 'image' | 'video';
  descripcion: string;
  categoria?: string;
}

@Component({
  selector: 'app-media-gallery',
  // standalone: true,
  // imports: [CommonModule, FormsModule],
  templateUrl: './media-gallery.component.html',
  styleUrls: ['./media-gallery.component.css']
})
export class MediaGalleryComponent implements OnDestroy {
  /** Título de la tarjeta */
  @Input() title: string = 'Galería de Archivos';

  /** Icono FontAwesome para el header */
  @Input() iconClass: string = 'fas fa-camera';

  /** Listado completo de archivos ya guardados/existentes */
  @Input() items: TestigoFotografico[] = [];

  /** Categoría para filtrar la visualización ('entrada' o 'proceso') */
  @Input() categoryFilter?: string;

  /** Controla la visibilidad del botón de carga desde el componente padre */
  @Input() showUploadButton: boolean = false;

  /** Texto dinámico opcional para el botón */
  @Input() uploadButtonText: string = 'Agregar Multimedia';

  /** Permite eliminar ítems guardados existentes */
  @Input() allowDeleteExisting: boolean = false;

  /** Emite los archivos preparados con sus comentarios para subir al servidor */
  @Output() uploadRequested = new EventEmitter<{ items: { file: File; descripcion: string }[]; category?: string }>();

  /** Emite el ID o ítem a eliminar del arreglo existente */
  @Output() itemDeleted = new EventEmitter<TestigoFotografico>();

  /** Arreglo local para archivos en cola de previsualización antes de subir */
  public stagedFiles: StagedMedia[] = [];

  get filteredItems(): TestigoFotografico[] {
    if (!this.items) return [];
    if (!this.categoryFilter) return this.items;
    return this.items.filter(item => item.categoria === this.categoryFilter);
  }

  /** Selección de archivos mediante el botón de adjuntar */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFiles = Array.from(input.files);

      selectedFiles.forEach((file: File) => {
        const isVideo = file.type.startsWith('video/');
        const previewUrl = URL.createObjectURL(file);

        this.stagedFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file: file,
          previewUrl: previewUrl,
          media_type: isVideo ? 'video' : 'image',
          descripcion: '',
          categoria: this.categoryFilter
        });
      });

      input.value = ''; // Resetea el input para permitir re-selección
    }
  }

  /** Quitar un archivo de la cola de previsualización */
  removeStagedFile(index: number): void {
    const removed = this.stagedFiles.splice(index, 1)[0];
    if (removed && removed.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl); // Libera memoria
    }
  }

  /** Confirmar y enviar los archivos en cola con sus comentarios al componente padre */
  confirmUpload(): void {
    if (this.stagedFiles.length === 0) return;

    const payload = this.stagedFiles.map(staged => ({
      file: staged.file,
      descripcion: staged.descripcion
    }));

    this.uploadRequested.emit({
      items: payload,
      category: this.categoryFilter
    });

    // Limpia la cola y revoca las URLs en memoria
    this.clearStagedFiles();
  }

  /** Cancelar o limpiar toda la cola */
  clearStagedFiles(): void {
    this.stagedFiles.forEach(staged => URL.revokeObjectURL(staged.previewUrl));
    this.stagedFiles = [];
  }

  /** Notificar la eliminación de un ítem existente */
  onDeleteExisting(item: TestigoFotografico): void {
    this.itemDeleted.emit(item);
  }

  ngOnDestroy(): void {
    this.clearStagedFiles();
  }
}
