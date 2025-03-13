import { Component, Input, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';

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

  constructor(
    private localStorage: LocalStorageServiceService
  ) {}

  ngOnInit(): void {
    
    this.dtOptions = {
      searching: false, 
      paging: false, 
      info: false,
      order: [2,'desc']
    }

    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.deleteLast();

    this.isLoad = false;


  }

  private deleteLast () {

    for ( let item in this.dataEnergeticos ) {

      if (item == 'mes' || item == 'mesAnt' || item == 'anioAnt' ) {
        let total = this.dataEnergeticos[item].filter( data => data.entidad === 'Total');
        this.dataEnergeticos[item] = this.dataEnergeticos[item].filter( data => data.entidad !== 'Total');
        this.dataTotales.push(total);
      }     

    }   

  }

}
