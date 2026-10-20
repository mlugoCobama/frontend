import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FuncionesTablas } from '../../../compras/funciones-tablas';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';

@Component({
  selector: 'app-table-total-detalle',
  templateUrl: './table-total-detalle.component.html',
  styleUrl: './table-total-detalle.component.css'
})
export class TableTotalDetalleComponent implements OnInit {
  @Output() descargarDetalle = new EventEmitter<any>()
  @Output() isOpenModal = new EventEmitter<any>()
  @Input() datos: any[] = [];
  @Input() params: any;
  @Input() nameEmpresa: any = '';
  @Input() intercompania: any = '';
  @Input() isDownloadingDetalle;
  @Input() modalAbierto: boolean = false;

  
  datosFiltrados: any[] = [];
  selectedItem: any = null;
  busqueda: string = '';
  tiposCompras = ['Compras Generales', 'Compras Macro Taller', 'Compras Recursos Tecnologicos'];
  public modalRef?: BsModalRef;
  private ordenador!: FuncionesTablas<any>;

  constructor(
    private modalService: BsModalService,
  ){}

  ngOnInit(): void {
    this.ordenador = new FuncionesTablas(this.datos);
    this.datosFiltrados = [...this.datos];
  }

  ordenarPor(columna: keyof any): void {
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna: keyof any): string {
    return this.ordenador.getIcono(columna);
  }

  filtrarTabla(): void {
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'folio_solicitud',
      'folio_orden_compra',
      'proveedor',
      'at',
      'servicio'
    ]);
  }

  // seleccionar(dato: any, evento: any): void {
  //   this.selectedItem = this.selectedItem === dato ? null : dato;
  //   this.openModalNuevo(this.selectedItem)
  // }


public seleccionar(dato: any, evento: any) {
  if (this.selectedItem === dato) {
    this.selectedItem = null;
  } else {
    this.selectedItem = dato;
    this.openModalNuevo(this.selectedItem)
  }
}


  get total(): number {
    return this.datos.reduce((sum, item) => sum + (+item.total_por_folio || 0), 0);
  }

  public openModalNuevo(item) {
      this.modalAbierto = true;
      this.isOpenModal.emit(true);
      const initialState: ModalOptions = {
        initialState: {
          data : item //Datos que envió al componente
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(ModalDetalleComponent, initialState);
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        // this.isLoad = true;
        // this.getAll(this.usuarioSolicita.intercompania);
      });
      this.modalRef.content.modalCerrado.subscribe(() => {
        this.isOpenModal.emit(false);
        this.modalAbierto = false;
      });
    }

  btnDescargarDetalle(){
    this.descargarDetalle.emit(this.intercompania)
  }
}


