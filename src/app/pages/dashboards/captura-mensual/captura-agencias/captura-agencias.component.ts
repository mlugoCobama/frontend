import { Component, OnInit } from '@angular/core';
import {
  ResponseCatEmpresas,
  CatEmpresas,
} from "src/app/core/models/cat-empresas";
import dataMeses from "src/environments/meses.json";
import { AlertErrorService } from "src/app/core/services/alert-error.service";
import { CatEmpresasService } from "src/app/core/services/cat-empresas.service";



@Component({
  selector: 'app-captura-agencias',
  templateUrl: './captura-agencias.component.html',
  styleUrls: ['./captura-agencias.component.css']
})
export class CapturaAgenciasComponent implements OnInit {

  public catEmpresas: CatEmpresas[];

  public meses = dataMeses;
  
  ngOnInit() {
  }

  constructor(
    private catEmpresasService: CatEmpresasService,
    public alertService: AlertErrorService,

  ) {}

  public getAgencias(){
    this.catEmpresasService.getAll(this.subDivision).subscribe(
          (data: ResponseCatEmpresas) => {
            if (data.success) {
              this.catEmpresas = data.data;
              // this.buildFormDatosEnergeticos();
            } else {
              this.alertService.alertError(data.message, data.success);
            }
          },
          (error) => {
            this.alertService.alertError(error, false);
          }
        );
  }

  public subDivision:any;
  public onSelectedSdivision(value: number) {
    this.subDivision = value;
    this.getAgencias();
  }


}
