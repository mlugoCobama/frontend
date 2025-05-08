import { Component, Input, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { Subject, Subscription } from "rxjs";
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';

import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';

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

  public sucursales: any;

  private actualizarDatosSubscripcion: Subscription;

    // varibles funciones tablas
      datosFiltrados:any[] = [];
      private ordenador!: FuncionesTablas<any>;
      busqueda:string = '';

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

    // this.reordenarData();
  }

  //Actualiza o inicializa los datos 
  private recuperarData(){
    this.dataEnergeticos = [];
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.deleteLast();
    // this.reordenarData();
  }

  // Elimina los totales del arreglo original y los agrega a dataTotales
  private deleteLast () {
    this.dataTotales = [];
    for ( let item in this.dataEnergeticos ) {
      
      if (item == 'mes' || item == 'mesAnt' || item == 'anioAnt' ) {
        let total = this.dataEnergeticos[item].filter( data => data.entidad === 'Total');
        this.dataEnergeticos[item] = this.dataEnergeticos[item].filter( data => data.entidad !== 'Total');
        this.dataTotales.push(total);
      }     
    }   
  }

  // public reordenarData(){
  //   let tabla = [];
  //   for (let i = 0; i < this.dataEnergeticos.mes.length; i++) {
  //     const mes = Number(this.dataEnergeticos.mes[i][this.concepto]) ?? 0;
  //     const entidad =  this.dataEnergeticos.mes[i]['entidad'];
  //     const mesA = Number(this.dataEnergeticos.mesAnt[i][this.concepto]) ?? 0;
  //     const anioAnt = Number(this.dataEnergeticos.anioAnt[i][this.concepto]) ?? 0;
  //     const fila = {'entidad': entidad , 'mes': mes, 'mesAnt':mesA, 'anioAnt': anioAnt}
  //     tabla.push(fila);
  //   }
  //   this.ordenador = new FuncionesTablas(tabla);
  //             this.datosFiltrados = [...tabla];
  //   console.table(this.datosFiltrados);
  // }
  

  // ordenarPor(columna: keyof any){
  //   this.datosFiltrados = this.ordenador.ordenar(columna);
  //   console.log('ordenado por',columna);
  //   console.log(this.datosFiltrados);
    
  // }

  // getIconoOrden(columna:keyof any):string{
  //   return this.ordenador.getIcono(columna)
  // }

}
