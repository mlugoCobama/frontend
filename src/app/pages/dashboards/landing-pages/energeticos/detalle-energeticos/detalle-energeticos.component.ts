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

    // this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    const fecha = new Date;
    this.mesSeleccionado = this.datepipe.transform((fecha.setMonth(fecha.getMonth() -1)), 'MM');
    this.anioSeleccionado = this.datepipe.transform((new Date), 'yyyy');
    this.filtrarInfo();

    console.log(this.mesSeleccionado);
    
  }

  public filtrarInfo(){
    // this.isLoad = true;
    this.energerticosGaseras.getAnual(1, this.mesSeleccionado, this.anioSeleccionado, this.divisionSeleccionada).subscribe(
      (data: ResponseEnergeticosGaseras) => {
        if (data.success) {
          this.localStorage.removeItem('DataEnergeticos');
          
          this.ordenarDatos(data)
          this.localStorage.setItem('DataEnergeticos', data.data); 
          this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');  
          this.energerticosGaseras.actualizarData();
          // this.isLoad = false;
        } else {
          this.alertService.alertError(data.message, data.success);
        }
      },
      (error) => {
        this.alertService.alertError(error, false);
      }
    );
    
    console.log(this.dataEnergeticos);
    
    // this.actionSearch();
  }

  public ordenarDatos(data){
    if(data.data['mes'].length > 1){
          const array1 =  data.data['mes'];
          const array_referencia = array1.map((item, index) => ({index, value: item[this.concepto]}))
          array_referencia.sort((a,b)  =>b.value-a.value)
          const array1_ordenado = array_referencia.map(item => array1[item.index]);
          data.data['mes'] = array1_ordenado;
          if(data.data['mesAnt'].length > 1){
            const array2 =  data.data['mesAnt'];
            const array2_ordenado = array_referencia.map(item => array2[item.index]);
            data.data['mesAnt'] = array2_ordenado;
          }
          if(data.data['anioAnt'].length > 1){
            const array3 =  data.data['anioAnt'];
            const array3_ordenado = array_referencia.map(item => array3[item.index]);
            data.data['anioAnt'] = array3_ordenado;
          }     
    }
          
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
