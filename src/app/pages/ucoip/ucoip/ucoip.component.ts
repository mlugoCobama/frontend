import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UcoipService } from 'src/app/core/services/ucoip/ucoip.service';
import { environment } from 'src/environments/environment';
import { ModalUcoipComponent } from './modal-ucoip/modal-ucoip.component';

UcoipService

@Component({
  selector: 'app-ucoip',
  templateUrl: './ucoip.component.html',
  styleUrls: ['./ucoip.component.css']
})
export class UcoipComponent implements OnInit {

  public data: any;
  public showTable:boolean = false;
  dtOptions: Config = {};
  public modalRef?: BsModalRef;

  constructor(
    private ucoipService: UcoipService,
    private modalService: BsModalService,
  ){}

  public ngOnInit(): void {
    this.dtOptions = environment.dataTables;
    this.getAll();
  }

  private getAll() {

    this.ucoipService.getAll()
                      .subscribe(
                        response => {
                            if (response.success) {
                              this.data = response.data;
                              this.showTable = true;
                            } else {
                            

                            }

                        },
                        error => {
                            console.error('Error fetching data:', error);
                        }
                      );
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

    this.modalRef = this.modalService.show(ModalUcoipComponent, {
      initialState,
      class: 'modal-lg'
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
