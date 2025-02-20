import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-tabla-captura',
  templateUrl: './form-tabla-captura.component.html',
  styleUrls: ['./form-tabla-captura.component.css']
})
export class FormTablaCapturaComponent implements OnInit {

  public tableData:{
    value:string;
    colspan:number;
   }[][] = [];
  // public tableData: string[][] = []; 
  public headers: string[] = [];

  constructor() {}

  ngOnInit() {}

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text');
    if (!clipboardData) return;

    const rows = clipboardData.split('\n').map(row => row.split('\t').map(cell => cell.trim()));

    const filasFiltradas = rows.filter(row => row.some(cell =>cell.length > 0));

    this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];

    this.tableData = this.processMergedCells(filasFiltradas);

    console.log(this.tableData);
  }


public prepararDatos(){
  if(this.tableData.length === 0) return;

  const headers = this.headers.shift().slice();

  console.log(headers);
}

private processMergedCells(rows: string[][]): { value: string; colspan: number }[][] {
  return rows.map(row => {
    let processedRow: { value: string; colspan: number }[] = [];
    let previousCell = "";

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      let cell = row[colIndex];

      if (cell === "" && previousCell !== "") {
        processedRow[processedRow.length - 1].colspan += 1;
        } else {
          processedRow.push({ value: cell, colspan: 1 });
          previousCell = cell;
        }
      }

      return processedRow;
    });
  }

}

