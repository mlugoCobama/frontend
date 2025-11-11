import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";
import { SwalComprsServiceService } from "src/app/core/services/compras/swal-comprs-service.service";

@Component({
  selector: "app-modal-preview-orden-compra",
  templateUrl: "./modal-preview-orden-compra.component.html",
  styleUrl: "./modal-preview-orden-compra.component.css",
})
export class ModalPreviewOrdenCompraComponent implements AfterViewInit, OnDestroy{
  public event: EventEmitter<any> = new EventEmitter();
  public modalCerrado: EventEmitter<any> = new EventEmitter();

  public solicitudCompra: any;
  public pdfUrl: SafeResourceUrl | null = null;
  public nombreArchivoPDF:any;

  constructor(
    public modalRef: BsModalRef,
    public ordenesCompra: OrdenesCompraService,
    public alertasService: SwalComprsServiceService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
  if (this.solicitudCompra?.folio_oc) {
    this.ordenesCompra.getPreviewUrl(this.solicitudCompra.id).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const fileName = response.headers.get('X-Filename') || 'orden_compra.pdf';

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        this.nombreArchivoPDF = fileName;
      },
      error: (err) => {
        console.error('Error cargando PDF:', err);
      }
    });
  }
}

 btnDescargarOC() {
  this.ordenesCompra.pdfOrdenCompra(this.solicitudCompra.id).subscribe(
    (response) => {
      const blob = new Blob([response.body!], { type: "application/pdf" });
       console.log(response.headers)
      const fileName = response.headers.get('X-Filename') || 'orden_compra.pdf';

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

  ngOnDestroy() {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl as any);
    }
  }

  /**
   * cierra la ventana modal
   */
  public cerrarModal(): void {
    this.modalRef.hide();
    setTimeout(() => {
      this.modalCerrado.emit();
    }, 150);
  }
}
