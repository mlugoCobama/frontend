import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import { ColumnaConfig, FiltroConfig } from 'src/app/shared/ui/datatable-generico/datatable-generico.component';

import { TokensAgenciasService } from 'src/app/core/services/ucoip/tokens-agencias.service';
import { ModalTokenAgenciaComponent } from './modal-token-agencia/modal-token-agencia.component';

@Component({
  selector: 'app-tokens-agencias',
  templateUrl: './tokens-agencias.component.html',
  styleUrls: ['./tokens-agencias.component.css']
})
export class TokensAgenciasComponent implements OnInit {

  constructor(
    private tokensService: TokensAgenciasService,
    private modalService: BsModalService
  ) { }

  public modalRef?: BsModalRef;

  public dataTokens: any[] = [];
  public catPuestos: any[] = [];
  public empresas: any[] = [];
  public sistemas: any[] = [];
  public isLoad = true;
  public itemSeleccionado: any =  null;

  ngOnInit(): void {
    this.getTokens();
  }

  columnas: ColumnaConfig[] = [
    {
      header: 'Estado', field: 'estatus', centered: true,
      badge: {
        backField: 'estatus',
        backColorMap: {  1: 'bg-success',
                         2: 'bg-primary' },
        transform: (val:any) => ({ 1: 'DISPONIBLE', 2: 'ASIGNADO'}[val] ?? 'DESCONOCIDO')

      },
    },
    {
      header: 'Token',
      field: 'token',
    },
    {
      header: 'Puestos Marca',
      field: 'puesto_marca.puesto'
    },
    {
      header: 'Sucursal',
      field: 'sucursal.nombre',
    }
  ];

  filtros: FiltroConfig[] = [
    {
      label: 'Todos los estados',
      field: 'activo',
      columnIndex: 0,
      opciones: ['Disponible', 'Asignado']
    },
    {
      label: 'Todos los puestos',
      field: 'puesto_marca.puesto',
      columnIndex: 2,
      dynamic: true
    },
    {
      label: 'Todos las sucursales',
      field: 'sucursal.nombre',
      columnIndex: 3,
      dynamic: true
    },


  ];

  public getTokens(): void {

    this.isLoad = true;

    this.tokensService.getAll().subscribe({

      next: (response: any) => {

        this.dataTokens = response.data.tokens;
        this.catPuestos = response.data.puestos;
        this.empresas = response.data.sucursales;

        this.isLoad = false;

      },

      error: () => {

        this.isLoad = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No fue posible cargar los tokens.'
        });

      }

    });

  }

  public openModalNuevo(): void {

    const initialState: ModalOptions = {

      initialState: {

        tipo: 'agregar',
        sistemas: this.sistemas,
        puestos: this.catPuestos,
        empresas: this.empresas,

      },

      class: 'modal-lg'

    };

    this.modalRef = this.modalService.show(
      ModalTokenAgenciaComponent,
      initialState
    );

    this.modalRef.content.event.subscribe(() => {

      this.getTokens();

    });

  }

  public openEdit(item: any): void {

    const initialState: ModalOptions = {

      initialState: {

        tipo: 'actualizar',
        data: item,
        sistemas: this.sistemas,
        puestos: this.catPuestos,
        empresas: this.empresas,

      },

      class: 'modal-lg'

    };

    this.modalRef = this.modalService.show(
      ModalTokenAgenciaComponent,
      initialState
    );

    this.modalRef.content.event.subscribe(() => {

      this.getTokens();

    });

  }

  confirmarEliminacion(id: number | string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger ms-2',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRegistro(id);
      }
    });
  }

  eliminarRegistro(id: any) {
      this.tokensService.delete(id).subscribe(
            (response) => {
              if (response.success) {
                Swal.fire({
                  title: "¡Eliminado!",
                  text: "El registro ha sido eliminado correctamente.",
                  icon: "success",
                  showConfirmButton: false,
                });
                this.itemSeleccionado = null;
                this.getTokens();
              } else {
                this.itemSeleccionado = null;
                console.log(response.message);
              }
            },
            (error) => {
              this.itemSeleccionado = null;
              console.error("Error fetching data:", error);
            },
          );
          this.itemSeleccionado = null;
    }

  public setItemSeleccionado(item:any){
      this.itemSeleccionado =  item;
  }
}
