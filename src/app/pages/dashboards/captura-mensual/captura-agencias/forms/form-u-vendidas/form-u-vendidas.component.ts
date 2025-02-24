import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";


@Component({
  selector: 'app-form-u-vendidas',
  templateUrl: './form-u-vendidas.component.html',
  styleUrls: ['./form-u-vendidas.component.css']
})
export class FormUVendidasComponent implements OnInit{

@Input() catEmpresas: CatEmpresas[];

public formUnidadesVendidas: FormGroup;

ngOnInit() {
  // this.buildFormUnidadesVendidas
  this.buildFormUnidadesVendidas()
  // console.log(this.catEmpresas)
}

  private modelInputs = {
    nuevos: "",
    utilidad_nuevos: "",
    flotillas: "",
    utilidad_flotillas: "",
    seminuevos: "",
    utilidad_seminuevos: ""
  };

constructor(
    public formBuilder: FormBuilder,
    private catEmpresasService: CatEmpresasService,
  ) {}

private buildFormUnidadesVendidas() {
  // console.log(this.catEmpresas);
   const fields = {};

   this.formUnidadesVendidas = this.formBuilder.group({});

   Object.entries(this.catEmpresas).forEach((data) => {
     for (const field of Object.keys(this.modelInputs)) {
       this.formUnidadesVendidas.addControl(
         field + "_" + data[1].id,
         this.formBuilder.control(0, Validators.required)
       );
     }
   });

   console.warn(this.formUnidadesVendidas);
}

getControlName(rowIndex: number, colIndex: number): string {
  const rowKeys = ['nuevos', 'utilidad_nuevos', 'flotillas', 'utilidad_flotillas', 'seminuevos', 'utilidad_seminuevos'];
  return `${rowKeys[rowIndex]}_${this.catEmpresas[colIndex].id}`;
}

onPaste(event: ClipboardEvent){
  event.preventDefault();
  const clipboardData = event.clipboardData?.getData('text');
  if(!clipboardData) return;

  const rows = clipboardData.split('\n').map(row=>row.split('\t'));
  rows.forEach((row, rowIndex)=>{
    row.forEach((cell, colIndex)=>{
      const controlName = this.getControlName(rowIndex, colIndex);
      if(this.formUnidadesVendidas.controls[controlName]){
        this.formUnidadesVendidas.controls[controlName].setValue(cell.trim());
      }
    })
  })
}

}
