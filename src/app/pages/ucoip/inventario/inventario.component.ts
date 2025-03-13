import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Inventario } from 'src/app/core/models/ucoip/inventario';

import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';
import { ModalInventarioComponent } from './modal-inventario/modal-inventario.component';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  public isLoad: boolean = true;

  public dataInventario: any[] = [];

  public dtOptions: Config = {};

  public modalRef?: BsModalRef;

  constructor(
      public inventarioService : InventarioService,
      public alertService: AlertErrorService,
      private modalService: BsModalService,
    ) {}

  ngOnInit(): void {
    this.getAll();
  }

  private getAll() {

    this.inventarioService.data$.subscribe((data) => {
      this.dataInventario = data;
      this.isLoad = false;
    });

    this.inventarioService.loadData();
    this.isLoad = false

    /*this.inventarioService.getAll().subscribe(
      (data: any) => {
        if (data.success) {

          this.dataInventario = data.data;
          this.isLoad = false

          this.dtOptions = {
            searching: true, 
            paging: true, 
            info: false,
            order: [0,'asc']
          }

        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );*/
  }

  public openModal() {
    const initialState = {
      listaDatos: [
        {
          data: [],
          tipo: 'agregar',
        },
      ],
    };

    this.modalRef = this.modalService.show(ModalInventarioComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res) => {
      this.isLoad = true;
      this.dataInventario = [];
      if (res.data) {
        this.modalRef.hide();
        this.inventarioService.loadData();
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
    };

    this.modalRef = this.modalService.show(ModalInventarioComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });

    this.modalRef.content.closeBtnName = 'Close';
    this.modalRef.content.event.subscribe((res) => {
      if (res.data) {
        this.modalRef.hide();
        //this.getAll();
      }
    });
  }

}
