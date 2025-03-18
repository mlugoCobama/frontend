import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseEnergeticosGaseras } from 'src/app/core/models/dashboard/energeticos-gaseras';
import { AlertErrorService } from 'src/app/core/services/alert-error.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import dataMeses from "src/environments/meses.json";


@Component({
  selector: 'app-detalle-energeticos',
  templateUrl: './detalle-energeticos.component.html',
  styleUrls: ['./detalle-energeticos.component.css']
})
export class DetalleEnergeticosComponent implements OnInit{

  public concepto: string;

  public isLoad: boolean = true;

  public dataEnergeticos: any;

  public meses = dataMeses;

  public mesSeleccionado: any = 0;
  
  public anioSeleccionado: any = 0;

  private divisionSeleccionada: string = 'all';

  constructor(
    private route: ActivatedRoute,
    private localStorage: LocalStorageServiceService,
    public datepipe: DatePipe,
    public alertService: AlertErrorService,
    private energerticosGaseras: EnergeticosGaserasService,
  ) {}

  ngOnInit(): void {
    this.concepto = this.route.snapshot.paramMap.get('concepto')
    this.isLoad = false;

    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');  
    
    this.mesSeleccionado = this.datepipe.transform((new Date), 'MM');
    this.anioSeleccionado = this.datepipe.transform((new Date), 'yyyy');

    console.log(this.mesSeleccionado);
    
  }

  public filtrarInfo(){
    this.energerticosGaseras.getAnual(1, this.mesSeleccionado, this.anioSeleccionado, this.divisionSeleccionada).subscribe(
      (data: ResponseEnergeticosGaseras) => {
        if (data.success) {;
          this.localStorage.removeItem('DataEnergeticos'); 
          this.localStorage.setItem('DataEnergeticos', data.data); 
          this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');  
          this.energerticosGaseras.actualizarData();
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
    
    // this.actionSearch();
  }


  public onChange(select: string, value: any) {
    // console.log(value);
    if (select === 'selectMes') {
      this.mesSeleccionado = value;
    } else {
      this.anioSeleccionado = value;
    }

  }

  public onChangeDivision(value: string){
    this.divisionSeleccionada = value;
    this.filtrarInfo();
  }

}
