import { ContentObserver } from '@angular/cdk/observers';
import { Component, EventEmitter, inject, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlmacenProductosService } from 'src/app/core/services/compras/almacen-productos.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';

export interface DetalleSalida {
  id_detalle: number;
  cant: string | number;
  unidadMedida: string;
  descripcion: string;
  observaciones: string;
  tipo: string;
}

export interface SalidaKardex {
  id: number;
  folio: string;
  fecha: string;
  usuario_entrega: string;
  usuario_recibe: string;
  detalles: DetalleSalida[];
}

@Component({
  selector: 'app-salida-detalle-modal',
  templateUrl: './salida-detalle-modal.component.html',
  styleUrl: './salida-detalle-modal.component.css'
})
export class SalidaDetalleModalComponent {

  public event: EventEmitter<any> = new EventEmitter();
  @Input() data: SalidaKardex | null = null;

  private archivoSeleccionado: File | null = null;
  public subiendo: boolean = false;

  public modalRef = inject(BsModalRef);
  public almacenProducto = inject(AlmacenProductosService);
  public alertasService = inject(SwalComprsServiceService);


   /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
  }

    btnDescargarFormato() {
    this.almacenProducto.pdfEntregaInsumos(this.data!.id).subscribe(
      (response) => {
        const blob = new Blob([response.body!], { type: "application/pdf" });
        const fileName = this.data!.folio+'.pdf';

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      }
    );
  }


  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  subirArchivo(): void {
    if (!this.archivoSeleccionado) {
      this.alertasService.mostrarAlerta('Error!', 'Primero agrega un archivo', 'error', 'danger');
      return;
    }

    this.subiendo = true;

    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado, this.archivoSeleccionado.name);
    formData.append('id', String(this.data!.id));

    this.almacenProducto.subirAcuse(formData).subscribe({
      next: (response) => {
        if(response.status == 'success'){
          this.alertasService.mostrarAlerta('Listo!', response.message, 'success', 'success');
          this.event.emit();
        }else{ this.alertasService.mostrarAlerta('Error!', response.message, 'error', 'danger'); }
      },
      error: (error) => {
        this.alertasService.mostrarAlerta('Error!', error, 'error', 'danger');
      },
      complete: () => {
        this.subiendo = false;
        this.archivoSeleccionado = null;
      }
    });
  }

  verArchivo(ruta:any){
    this.almacenProducto.abrirArchivo(ruta);
  }

}
