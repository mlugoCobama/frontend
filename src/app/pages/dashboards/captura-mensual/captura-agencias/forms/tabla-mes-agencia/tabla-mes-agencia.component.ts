import { Component, Input, Output, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-tabla-mes-agencia',
  templateUrl: './tabla-mes-agencia.component.html',
  styleUrls: ['./tabla-mes-agencia.component.css']
})
export class TablaMesAgenciaComponent implements OnInit {

  @Input() dataMesAgencias: any;

  public tableData: any;

  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
  @Input() catEmpresas:any;
  public onPaste(event){
    console.log(event);

  }
  public showInstructions: boolean = false;
  
  ngOnInit() {

  }




  
}
