import { Component, inject, OnInit } from '@angular/core';
import { CatProductosService } from 'src/app/core/services/compras/cat-productos.service';
import { ProveedoresService } from 'src/app/core/services/compras/proveedores/proveedores.service';
import { SwalComprsServiceService } from 'src/app/core/services/compras/swal-comprs-service.service';
import { finalize } from 'rxjs';
import { PrecioProveedor, PreciosPayload, Producto, Proveedor } from './form-precios/catalogo.models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalProductosComponent } from './modal-productos/modal-productos.component';
import { CatUnidadesMedidasService } from 'src/app/core/services/compras/unidadesMedidas/cat-unidades-medidas.service';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: "app-cat-productos",
  templateUrl: "./cat-productos.component.html",
  styleUrl: "./cat-productos.component.css",
})
export class CatProductosComponent implements OnInit {

  public isLoad: boolean = false;
  public saving: boolean = false;
  public data: any = [];
  public subCategorias: any = [];
  public productosCategorias: any = [];
  public sistemaSeleccionado: any = null;
  public subCategoriaSeleccionada: any = null;
    unidadesMedida: any = [];
  public maxProveedores = 3;
  dropdownOpen: boolean = false;
    public modalRef?: BsModalRef;

  proveedoresDisponibles: any[] = [];
  proveedoresSeleccionados: any[] = [];

  productosMatriz: Producto[] = [];
  proveedoresMatriz: Proveedor[] = [];
  preciosExistentes: PrecioProveedor[] = [];

  private catProductosService = inject(CatProductosService);
  private proveedoresService = inject(ProveedoresService);
  private alertasService = inject(SwalComprsServiceService);
  private modalService =  inject(BsModalService);
  private catUnidadesMedidasService = inject(CatUnidadesMedidasService);
  private permisosService = inject(PermisosService);

  ngOnInit(): void {
    this.getCatalogoProductos();
    this.getProveedores();
    this.getUnidades()
  }

  public getCatalogoProductos() {
    this.catProductosService.getCatalogoProductos().subscribe(
      (response: any) => {
        if (response) {
          this.data = response.data;

          this.isLoad = false;
        } else {
          this.isLoad = false;
          console.log(response.message);
        }
      },
      (error) => {
        this.isLoad = false;
        console.error("Error fetching data:", error);
      },
    );
  }

  private getProveedores() {
    this.proveedoresService.getProveedores().subscribe(
      (response) => {
        if (response) {
          this.proveedoresDisponibles = response.data;
          this.isLoad = false;
        } else {
          this.alertasService.mostrarAlerta(
            "Error!",
            response.message,
            "error",
            "danger",
          );
        }
      },
      (error) => {
        this.alertasService.mostrarAlerta("Error!", error, "error", "danger");
      },
    );
  }

  private limpiarMatriz(): void {
    this.productosMatriz = [];
    this.proveedoresMatriz = [];
    this.preciosExistentes = [];
  }

  selectCategoriasChange(event: any): void {
    this.subCategorias = event?.sub_categorias || [];
    this.sistemaSeleccionado = event;
    this.proveedoresSeleccionados = [];
    this.subCategoriaSeleccionada = null;
    this.productosCategorias = [];
    this.limpiarMatriz();
  }

  selectSubcategoriasChange(event: any): void {
    this.subCategoriaSeleccionada = event;
    this.productosCategorias = event.productos_activos;
    this.limpiarMatriz();
  }


  esProveedorSeleccionado(prov: any): boolean {
    return this.proveedoresSeleccionados.some((p) => p.id === prov.id);
  }

  // Controla que solo se puedan marcar hasta 3 proveedores
  toggleProveedor(prov: any, event: any): void {
    const checked = event.target.checked;

    if (checked) {
      if (this.proveedoresSeleccionados.length >= this.maxProveedores) {
        event.target.checked = false;
        alert(
          "Solo puedes seleccionar un máximo de 3 proveedores para comparar precios.",
        );
        return;
      }
      this.proveedoresSeleccionados.push(prov);
    } else {
      this.proveedoresSeleccionados = this.proveedoresSeleccionados.filter(
        (p) => p.id !== prov.id,
      );
    }

    // if (this.productosCategorias.length > 0) {
    //   this.construirMatrizFormulario();
    // }
  }

buscarProductos(): void {
  if (!this.subCategoriaSeleccionada || this.proveedoresSeleccionados.length === 0) return;

  const productos = [...this.productosCategorias];
  const proveedores = [...this.proveedoresSeleccionados];

  this.isLoad = true;
  this.catProductosService
    .obtenerPreciosLote(proveedores.map((p) => p.id), productos.map((p) => p.id))
    .pipe(finalize(() => (this.isLoad = false)))
    .subscribe({
      next: (res: any) => {
        this.preciosExistentes = res.data ?? [];
        this.productosMatriz = productos;
        this.proveedoresMatriz = proveedores;
      },
      error: (err) => this.alertasService.mostrarAlerta('Error!', err, 'error', 'danger'),
    });
}

onGuardarPrecios(payload: PreciosPayload): void {
  this.saving = true;
  this.catProductosService
    .saveCatalogoPrecios(payload)
    .pipe(finalize(() => (this.saving = false)))
    .subscribe({
      next: () => this.buscarProductos(),
      error: (err) => this.alertasService.mostrarAlerta('Error!', err, 'error', 'danger'),
    });
}

onLimiteProveedores(max: number): void {
  this.alertasService.mostrarAlerta(
    'Aviso',
    `Solo puedes seleccionar un máximo de ${max} proveedores.`,
    'warning',
    'warning',
  );
}

  public openModalNuevo() {
    const initialState: ModalOptions = {
      initialState: {
        catCategorias: this.data,
        unidadesMedida : this.unidadesMedida,
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalProductosComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.getCatalogoProductos();
    });
  }

  public openModalActualizar() {
    const initialState: ModalOptions = {
      initialState: {
        catCategorias: this.data,
        categoria: this.sistemaSeleccionado,
        producto: this.itemSeleccionado,
        unidadesMedida : this.unidadesMedida,
        tipo: 'actualiza'
      },
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(ModalProductosComponent, initialState);
    this.modalRef.content.closeBtnName = "Close";
    this.modalRef.content.event.subscribe(() => {
      this.getCatalogoProductos();
    });
  }

  itemSeleccionado =  null;
  public setItemSeleccionado(dato:any){
    this.itemSeleccionado = null;
    if(dato){
      this.itemSeleccionado = dato ?? null;
    }

  }

  public deleting = false;
  public async eliminarProducto(){
    this.deleting = true;
    const confirmado = await this.alertasService.mostrarConfirmacion('Ya casi!', `Estas seguro que deseas borrar este producto esta accion no puede deshacerse`)

    if (!confirmado) {
      this.deleting = false;
      return;
    }

    this.catProductosService.borrarProducto(this.itemSeleccionado!.id).subscribe(
      (response) => {
        if (response.status = 'success') {
          this.alertasService.mostrarAlerta('Listo', response.message, 'success', 'success')
          this.deleting = false;
          this.productosCategorias = this.productosCategorias.filter(
            (producto: any) => producto.id !== this.itemSeleccionado!.id
          );
          this.buscarProductos();

        } else {
          this.deleting = false;
          console.log(response.message);
        }
      },
        (error) => {
          this.deleting = false;
          console.error("Error fetching data:", error);
      }
    );

  }

    private getUnidades() {
    this.catUnidadesMedidasService.getAll().subscribe(
      (response) => {
        if (response) {
          this.unidadesMedida = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }

  tienePermiso(permiso: string = ''): boolean {
    if (!permiso) return true;
    return this.permisosService.tienePermiso(permiso);
  }

}
