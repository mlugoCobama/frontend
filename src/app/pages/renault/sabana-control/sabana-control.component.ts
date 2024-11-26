import { Component, OnInit } from '@angular/core';
import { SabanaControlService } from 'src/app/core/services/renault/sabana-control.service';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalSabanaControlComponent } from './modal-sabana-control/modal-sabana-control.component';

@Component({
  selector: 'app-sabana-control',
  templateUrl: './sabana-control.component.html',
  styleUrls: ['./sabana-control.component.css']
})
export class SabanaControlComponent implements OnInit {

  public DataCitas: any = {};

  public isLoad: boolean = true;

  constructor(
    public sabanaControlService : SabanaControlService,
    public alertService: AlertErrorService,
    public bsModalRe: BsModalRef,
    public modalService: BsModalService,
  ) {}

  public ngOnInit(): void {
    this.getAll();
  }

  private getAll() {

    this.sabanaControlService.getAll().subscribe(
      (data: any) => {
        if (data.success) {

          this.DataCitas = data.data;
          this.isLoad = false

        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );

  }

  public openModal(data: any) {
    const initialState: ModalOptions = {
      initialState: {
        data: data,
        title: 'Detalle de Cita de Servicio ' + data.folio
      },
      class: 'modal-lg'
    };
    this.bsModalRe = this.modalService.show(ModalSabanaControlComponent,initialState );
    this.bsModalRe.content.closeBtnName = 'Close';

    //this.bsModalRe.content.event.subscribe((res: any) => {});

  }

}
