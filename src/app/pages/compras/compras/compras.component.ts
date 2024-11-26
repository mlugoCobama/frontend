import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Config } from 'datatables.net';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  public dtOptions: Config = {};
  public data: any;
  public showTable:boolean = false;

  public modalRef?: BsModalRef;

  public submitted: boolean = false;

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.dtOptions = environment.dataTables;
  }

  /**
   * Open modal
   * @param content modal content
   */
  public openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }


  public addRow() {
    let table = document.getElementById('tableCompraInsumos') as HTMLTableElement;;

    let row = table.insertRow(table.rows.length);
  }
}
