import { Component, Input, OnInit, EventEmitter, ViewChild, AfterViewInit } from "@angular/core";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { OrdenesCompraService } from "src/app/core/services/compras/ordenesCompra/ordenes-compra.service";

@Component({
  selector: "app-modal-seguimiento",
  templateUrl: "./modal-seguimiento.component.html",
  styleUrl: "./modal-seguimiento.component.css",
})
export class ModalSeguimientoComponent implements AfterViewInit {
  public modalCerrado: EventEmitter<any> = new EventEmitter();
  public event: EventEmitter<any> = new EventEmitter();

  public solicitudCompra: any;
  public pdfUrl: SafeResourceUrl | null = null;
  public showPreview = false;
  public mostrarPreview = false;

  constructor(
    public modalRef: BsModalRef,
    public ordenesCompra: OrdenesCompraService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
  }

  togglePreview() {
    this.mostrarPreview = !this.mostrarPreview;
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
