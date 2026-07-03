import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CatSoftwareService } from 'src/app/core/services/ucoip/cat-software.service';
import { ColumnaConfig, FiltroConfig } from 'src/app/shared/ui/datatable-generico/datatable-generico.component';
import Swal from 'sweetalert2';
import { ModalSoftwareComponent } from './modal-software/modal-software.component';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrl: './software.component.css'
})
export class SoftwareComponent implements OnInit{

  constructor(
    private software: CatSoftwareService,
    private modalService: BsModalService,
  ){}

  ngOnInit(): void {
    this.getSoftware();
  }

  public modalRef?: BsModalRef;
  dataInventario:any = []
  isLoad:any = true;


columnas: ColumnaConfig[] = [
  {
    header: 'Estado', field: 'estatus', centered: true,
    colorField: {
      field: 'estatus',
      colorMap: { 1: 'text-primary', 2: 'text-success', 3: 'text-danger' },
      transform: (val:any) => ({ 1: 'Disponible', 2: 'Asignado', 3: 'Obsoleto' }[val] ?? 'Desconocido')
    }
  },
  {
    header: 'Tipo', field: 'tipo_software.tipo', centered: true,
    badge: {
      dotField: 'estatus',
      dotColorMap: { 1: 'bg-primary', 2: 'bg-success', 3: 'bg-danger' }
    }
  },
  { header: 'Version',         field: 'version'    },
  { header: 'Licencia', field: 'licencia' },
];

filtros: FiltroConfig[] = [
  // { label: 'Todas las empresas', field: 'empresa', columnIndex: 5, dynamic: true },
  { label: 'Todos los tipos',    field: 'tipo_software.tipo', columnIndex: 1, dynamic: true },
  {
    label: 'Todos los estados', field: 'estatus', columnIndex: 0,
    opciones: ['Disponible', 'Asignado', 'Obsoleto']
  },
];

public openEdit(item:any){

}

public getSoftware(){
  this.isLoad = true;
      this.software.getAll().subscribe({
        next: (response) => {
          this.dataInventario = response.data;
          console.log(this.dataInventario);
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
          tipo: 'agregar'
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

}
