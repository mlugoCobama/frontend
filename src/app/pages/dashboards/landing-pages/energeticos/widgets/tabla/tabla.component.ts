import { Component, Input, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { Subject, Subscription } from "rxjs";
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { AgenciasService } from 'src/app/core/services/dashboard/agencias.service';
import { ResponseEnergeticosGaseras } from "src/app/core/models/dashboard/energeticos-gaseras";
import { ResponseAgenciasNissan } from 'src/app/core/models/dashboard/agencias-nissan';
import { FuncionesTablas } from 'src/app/core/helpers/funciones-tablas';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  @Input() concepto: string;
  @Input() tipo: string;

  public dataEnergeticos: any;

  public isLoad: boolean = true;

  public dtOptions: Config = {};

  public dataTotales: number[] = [] ;

  public sucursales: any;

  private actualizarDatosSubscripcion: Subscription;

  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService,
    private agencias: AgenciasService,
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

  public copiaData:any;
  //Actualiza o inicializa los datos 
  private recuperarData(){
    this.dataEnergeticos = [];
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.copiaData = this.localStorage.getItem('DataEnergeticos');
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

  
  public seleccionar(dato: any, evento: any) {
    const mes = this.dataEnergeticos['mes'].find((registro) => registro.id != "Total");
    const periodo =  mes.fecha.split("-");
    let anio = periodo[2];



    if (evento.currentTarget.classList.contains("table-active")) {
      evento.currentTarget.classList.remove("table-active");
      this.localStorage.removeItem("DataEnergeticos");
      this.localStorage.setItem("DataEnergeticos", this.copiaData);
      this.gaseras.actualizarData(); 
    } else {
      const filas = document.querySelectorAll("tbody tr");
      this.sutituirDataAnual(dato, anio)
      filas.forEach((fila) => fila.classList.remove("table-active"));
      evento.currentTarget.classList.add("table-active");
    }
  }

  public anio:any;
  public dataEstacion
  private sutituirDataAnual(id, anio){
    if(this.tipo === "energeticos"){
      this.gaseras.getAnualEstacion(id, anio).subscribe(
            (data: ResponseEnergeticosGaseras) => {
              if (data.success) {
                
                this.dataEstacion  =  data.data;
                
                this.dataEnergeticos.totalAnio = this.dataEstacion.totalAnio;
                this.dataEnergeticos.totalAnioAnt = this.dataEstacion.totalAnioAnt;
                this.dataEnergeticos.mes = this.copiaData.mes;
                this.dataEnergeticos.mesAnt = this.copiaData.mesAnt;
                this.dataEnergeticos.anioAnt = this.copiaData.anioAnt;
               
                this.localStorage.removeItem("DataEnergeticos");
                this.localStorage.setItem("DataEnergeticos", this.dataEnergeticos);

                this.gaseras.actualizarData(); 
              } else {
                console.log(data.message, data.success);
              }
            },
            (error) => {
              console.log(error, false);
            }
          );
    }else{
      this.agencias.getAnualAgencia(id, anio).subscribe(
            (data: ResponseAgenciasNissan) => {
              if (data.success) {
                
                this.dataEstacion  =  data.data;
                
                this.dataEnergeticos.totalAnio = this.dataEstacion.totalAnio;
                this.dataEnergeticos.totalAnioAnt = this.dataEstacion.totalAnioAnt;
                this.dataEnergeticos.mes = this.copiaData.mes;
                this.dataEnergeticos.mesAnt = this.copiaData.mesAnt;
                this.dataEnergeticos.anioAnt = this.copiaData.anioAnt;
               
                this.localStorage.removeItem("DataEnergeticos");
                this.localStorage.setItem("DataEnergeticos", this.dataEnergeticos);

                this.gaseras.actualizarData(); 
              } else {
                console.log(data.message, data.success);
              }
            },
            (error) => {
              console.log(error, false);
            }
          );
    }
    

  }
}
