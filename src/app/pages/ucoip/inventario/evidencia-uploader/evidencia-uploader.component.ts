import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evidencia-uploader',
  templateUrl: './evidencia-uploader.component.html'
})
export class EvidenciaUploaderComponent implements OnDestroy {

  @Input() label = 'Evidencia';
  @Input() bordeContainer = '';
  @Output() filesChange = new EventEmitter<File[]>();

  files: File[] = [];
  private previewUrls = new Map<File, string>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) {
      return;
    }

    this.revokeAll();
    this.files = Array.from(input.files);
    this.files.forEach(f => this.previewUrls.set(f, URL.createObjectURL(f)));

    this.filesChange.emit(this.files);
  }

  preview(file: File): string {
    return this.previewUrls.get(file) ?? '';
  }

  private revokeAll(): void {
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls.clear();
  }

  ngOnDestroy(): void {
    // Evita memory leaks de los blob: URLs generados con createObjectURL
    this.revokeAll();
  }
}