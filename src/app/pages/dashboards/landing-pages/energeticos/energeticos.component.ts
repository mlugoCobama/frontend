import { Component, OnInit } from '@angular/core';

import { AlertErrorService } from 'src/app/core/services/alert-error.service';

import { ResponseEnergeticosGaseras } from 'src/app/core/models/dashboard/energeticos-gaseras';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

@Component({
  selector: 'app-energeticos',
  templateUrl: './energeticos.component.html',
  styleUrls: ['./energeticos.component.css']
})
export class EnergeticosComponent implements OnInit {

  public dataMesActual: any;

  public dataMesAnterior: any;
  
  public dataMesAnioAnterior: any;

  public dataTotalAnio: any;
  
  public dataTotalAnioAnt: any;

  public isLoad: boolean = true;

  constructor(
      public alertService: AlertErrorService,
      private energerticosGaseras: EnergeticosGaserasService,
      private localStorage: LocalStorageServiceService
    ) {}

  ngOnInit(): void {
    this.getDataAnual();
  }

  private getDataAnual() {
    this.energerticosGaseras.getAnual(1).subscribe(
      (data: ResponseEnergeticosGaseras) => {
        if (data.success) {
          
          this.dataMesActual = data.data['mes'];
          this.dataMesAnterior = data.data['mesAnt'];
          this.dataMesAnioAnterior = data.data['anioAnt'];
          this.dataTotalAnio = data.data['totalAnio'];
          this.dataTotalAnioAnt = data.data['totalAnioAnt'];
          this.isLoad = false;

          this.localStorage.setItem('DataEnergeticos', data.data);

        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
  }

}
