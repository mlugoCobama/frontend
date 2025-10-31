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

  constructor(
    public modalRef: BsModalRef,
    public ordenesCompra: OrdenesCompraService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    if (this.solicitudCompra?.folio_oc) {
      this.ordenesCompra.getPreviewUrl(this.solicitudCompra.id).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          // this.showPreview = true;
        },
        error: (err) => {
          console.error("Error cargando PDF:", err);
        },
      });
    }
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
