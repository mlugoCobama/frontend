import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Config } from 'datatables.net';

import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { InventarioService } from 'src/app/core/services/ucoip/inventario.service';

@Component({
  selector: 'app-modal-ucoip-hardware',
  templateUrl: './modal-ucoip-hardware.component.html',
  styleUrl: './modal-ucoip-hardware.component.css'
})
export class ModalUcoipHardwareComponent implements OnInit{

  public isLoad: boolean = true;

  public dataInventario: any[] = [];

  public dtOptionsModal: Config = {};

  constructor(
    public bsModalRef: BsModalRef,
    public alertService: AlertErrorService,
    public inventarioService : InventarioService,
  ) {}

  public cerrarModal(): void {
    this.bsModalRef.hide();
  }

  ngOnInit(): void {
    // this.getAll();
  }
  
  // private getAll() {
  //   this.inventarioService.get(10).subscribe(
  //     (data: any) => {
  //       if (data.success) {

  //         this.dataInventario = data.data;

  //         this.dtOptionsModal = {
  //           searching: true, 
  //           paging: true, 
  //           info: false,
  //           order: [0,'asc']
  //         }

  //       } else {
  //         this.alertService.alertError(data.message, data.success);
  //       }
  //     },
  //     (error) => {
  //       this.alertService.alertError(error, false);
  //     }
  //   );
  // }
  
}
