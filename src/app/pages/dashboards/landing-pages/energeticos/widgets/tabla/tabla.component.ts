import { Component, Input, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { Subject, Subscription } from "rxjs";
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  @Input() concepto: string;

  public dataEnergeticos: any;

  public isLoad: boolean = true;

  public dtOptions: Config = {};

  public dataTotales: number[] = [] ;

  private actualizarDatosSubscripcion: Subscription;

  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService

  ) {}

  ngOnInit(): void {
    
    this.dtOptions = {
      searching: false, 
      paging: false, 
      info: false,
      order: [2,'desc']
    }

    this.actualizarDatosSubscripcion =
    this.gaseras.actualizarData$.subscribe(() => {
      this.recuperarData();
    });

    this.recuperarData();

    this.isLoad = false;


  }

  private recuperarData(){
    this.dataEnergeticos = [];
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.deleteLast();
  }

  private deleteLast () {
    this.dataTotales = [];
    for ( let item in this.dataEnergeticos ) {
      
      if (item == 'mes' || item == 'mesAnt' || item == 'anioAnt' ) {
        let total = this.dataEnergeticos[item].filter( data => data.entidad === 'Total');
        this.dataEnergeticos[item] = this.dataEnergeticos[item].filter( data => data.entidad !== 'Total');
        this.dataTotales.push(total);
      }     
    }   
    console.log(this.dataTotales);
  }
  
}
