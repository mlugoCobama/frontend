import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CatSoftwareService } from 'src/app/core/services/ucoip/cat-software.service';
import { ColumnaConfig, FiltroConfig } from 'src/app/shared/ui/datatable-generico/datatable-generico.component';
import Swal from 'sweetalert2';
import { ModalSoftwareComponent } from './modal-software/modal-software.component';
import { EmpresasService } from 'src/app/core/services/ucoip/empresas.service';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrl: './software.component.css'
})
export class SoftwareComponent implements OnInit{

  constructor(
    private software: CatSoftwareService,
    private modalService: BsModalService,
    private empresasService: EmpresasService
  ){}

  ngOnInit(): void {
    this.getSoftware();
    this.getEmpresas();
  }

  public modalRef?: BsModalRef;
  dataInventario:any = [];
  tiposSoftware:any = []
  isLoad:any = true;


columnas: ColumnaConfig[] = [
  {
    header: 'Tipo', field: 'tipo_software.tipo', centered: true,
    badge: {
      dotField: 'estatus',
      dotColorMap: { 1: 'bg-success', 2: 'bg-primary', 3: 'bg-danger' }
    }
  },
  {
    header: 'Estado', field: 'estatus', centered: true,
    badge: {
      backField: 'estatus',
      backColorMap: { 1: 'bg-success', 2: 'bg-primary', 3: 'bg-danger' },
      transform: (val:any) => ({ 1: 'DISPONIBLE', 2: 'ASIGNADO', 3: 'OBSOLETO' }[val] ?? 'DESCONOCIDO')
    
    },
  },

  { header: 'Version',  field: 'version' },
  { header: 'Licencia', field: 'licencia' },
  { header: 'Empresa', field: 'sucursal.nombre' },
  { header: 'Tipo', field: 'tipo_texto' },
  { header: 'F. Adquisición', field: 'fecha' },
  
];

filtros: FiltroConfig[] = [
  { label: 'Todas las empresas', field: 'sucursal.nombre', columnIndex: 4, dynamic: true },
  { label: 'Todos los tipos',    field: 'tipo_software.tipo', columnIndex: 0, dynamic: true },
  {
    label: 'Todos los estados', field: 'estatus', columnIndex: 1,
    opciones: ['Disponible', 'Asignado', 'Obsoleto']
  },
];

public openEdit(item:any){
    const initialState: ModalOptions = {
        initialState: {
          tipo: 'actualiazar',
          data: item,
          tipos: this.tiposSoftware,
          empresas: this.empresas
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalSoftwareComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.isLoad = true;

        // this.mostrar = false;
        this.getSoftware();
      });
      this.modalRef.content.modalCerrado.subscribe(() => {
        // this.modalAbierto = false;
      });
}

public getSoftware(){
  this.isLoad = true;
      this.software.getAll().subscribe({
        next: (response) => {
          this.dataInventario = response.data;
          this.tiposSoftware = response.tipos
          this.isLoad = false;
        },
        error: () => {
          this.isLoad = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los permisos'
          });
        }
      });
}

// Despliega la ventana modal para un nuevo registro
    public openModalNuevo() { 
      const initialState: ModalOptions = {
        initialState: {
          tipo: 'agregar',
          tipos: this.tiposSoftware,
          empresas: this.empresas
        },
        class: "modal-lg",
      };
      this.modalRef = this.modalService.show(
        ModalSoftwareComponent,
        initialState
      );
      this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        this.isLoad = true;

        // this.mostrar = false;
        this.getSoftware();
      });
      this.modalRef.content.modalCerrado.subscribe(() => {
        // this.modalAbierto = false;
      });
    }

    public empresas = [];
    private getEmpresas() {
    this.empresas = [];
    this.empresasService.getAll().subscribe({
      next: async (resp) => {
        if (resp.status == 'success') {
          this.empresas = resp.data;
          // this.isLoad = false;
        }else{
          console.error('Error al recuperar recursos');
        }
      },
      error: (err) => {
        console.error('Error al recuperar recursos', err);
      }
    });
  }
}
