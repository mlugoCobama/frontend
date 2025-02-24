import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-form-tabla-captura',
  templateUrl: './form-tabla-captura.component.html',
  styleUrls: ['./form-tabla-captura.component.css']
})
export class FormTablaCapturaComponent implements OnInit {
  public showInstructions: boolean = true;
  public tableData:{
    value:string;
    colspan:number;
   }[][] = [];
  // public tableData: string[][] = []; 
  public headers: string[] = [];

  @Input() catEmpresas: any;

  constructor() {}

  ngOnInit() {
    console.log(this.catEmpresas);
  }

onPaste(event: ClipboardEvent) {
  event.preventDefault();
  const clipboardData = event.clipboardData?.getData('text');
  if (!clipboardData) return;

  this.showInstructions = false;

    const rows = clipboardData.split('\n').map(row => row.split('\t').map(cell => cell.trim()));
    const filasFiltradas = rows.filter(row => row.some(cell =>cell.length > 0));
    this.headers = filasFiltradas.length > 0 ? filasFiltradas.shift()! : [];
    this.tableData = this.processMergedCells(filasFiltradas);
     console.log(this.tableData);
  }

  public campos: string[] =[]; 
//intento de  formatear los datos
// public prepararDatos(){
//   if(this.tableData.length === 0) {
//     window.alert("Pega la tabla")
//     return;
//   }

//   // const headers = this.headers.shift().slice();

//   const dataToSend = this.tableData.concat();

//   dataToSend.forEach(fila => {
//     if(fila.length === 1){
//       const deleteRow = fila.shift();//elimina la fila combinada
//     }else{
//       this.campos.push(fila[0].value)
      
//     }

//   });
//   console.log(this.campos);
//   console.log(this.tableData);
// }

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

  public proccesData() {
    let jsonData: Record<string, any> = {}; 
    let currentTable = ""; 
  
    this.tableData.forEach((row) => {
      if (row.length === 1) {
        
        currentTable = row[0].value;
        jsonData[currentTable] = []; 
      } else {
        
        let campo = row[0].value;
  
        row.slice(1).forEach((cell, index) => {
          const concesionaria = this.headers[index + 1];
          let record = jsonData[currentTable].find((r: any) => r[concesionaria]);
  
          if (!record) {
            record = { [concesionaria]: {} };
            jsonData[currentTable].push(record);
          }
  
          record[concesionaria][campo] = cell.value || "";
        });
      }
    });
  
    console.log(jsonData);
  }

  // public proccesData(){
  //   let jsonData:Record<string, any[]> = {};
  //   let seccion = "";

  //   this.headers.shift();
  //   this.headers.pop();

  //   this.tableData.forEach((row) =>{
  //     if(row.length === 1){
  //       seccion = row[0].value;
  //       jsonData[seccion]=[];
  //     }else{
  //       let obj:any ={};
  //       this.headers.forEach((header, index) => {
  //         obj[header] = row[index]?.value || ""
  //       })
  //       jsonData[seccion].push(obj);
  //     }
  //   })
  //   console.log(jsonData);
  // }
  
}

