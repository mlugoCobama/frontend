import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Inventario } from 'src/app/core/models/ucoip/inventario';

import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';
import { ModalInventarioComponent } from './modal-inventario/modal-inventario.component';
import { CatHardwareService
 } from 'src/app/core/services/ucoip/cat-hardware.service';
 import { EmpresasService } from 'src/app/core/services/ucoip/empresas.service';



@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  public isLoad: boolean = true;

  public dataCatHardware :any  = [];
  public empresas :any  = [];

  public dataInventario: any[] = [];

  public dtOptions: Config = {
    searching: true, 
    paging: true, 
    info: true, 
    order: [[0, 'asc']],
    language: {
    url: '/assets/es-mx.json'
  }
  };

  public modalRef?: BsModalRef;
  
  constructor(
      public inventarioService : InventarioService,
      public alertService: AlertErrorService,
      private modalService: BsModalService,
      private empresasService:  EmpresasService,
      private catHardwareService: CatHardwareService,
    ) {}

  ngOnInit(): void {
    
    this.getAll();
    this.getEmpresas();
    this.getCatHardware();
  }

  private getAll() {
    this.dataInventario = [];
    this.isLoad =  true;

  this.inventarioService.getAll().subscribe(
      (data: any) => {
        if (data.success) {

          this.dataInventario = data.data;
          this.isLoad = false

          this.dtOptions = {
              searching: true, 
              paging: true, 
              info: true, 
              order: [[0, 'asc']],
              language: {
              url: '/assets/es-mx.json'
            },
          }
         

        } else {
          this.isLoad = false;
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.isLoad = false;
        this.alertService.alertError(error, false);
      }
    );
  }

  

  public openModal() {
    const initialState = {
      listaDatos: [
        {
          data: [],
          tipo: 'agregar',
          
        },
      ],
      dataCatHardware: this.dataCatHardware,
      empresas: this.empresas
    };

    this.modalRef = this.modalService.show(ModalInventarioComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res:any) => {
      this.isLoad = true;
      this.dataInventario = [];
      if (res.data) {
        this.modalRef?.hide();
        this.getAll();
        // this.inventarioService.loadData();
      }
    });

  }

  public openEdit(item: any) {
    const initialState = {
      listaDatos: [
        {
          data: item,
          tipo: 'editar',
          
        },
      ],
      dataCatHardware: this.dataCatHardware,
      empresas: this.empresas
    };

    this.modalRef = this.modalService.show(ModalInventarioComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res:any) => {
      if (res.data) {
        this.modalRef?.hide();
        this.getAll();
      }
    });
  }

  public getCatalogos(){

  }

  private getCatHardware() {
    this.catHardwareService.getAll().subscribe(
      (data: any) => {
        if (data.success) {
          this.dataCatHardware = data.data;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

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
