import { Component, OnInit } from '@angular/core';
import { FuncionesTablas } from '../compras/funciones-tablas';
import { UnidadesService } from 'src/app/core/services/compras/unidades.service';

@Component({
  selector: 'app-cat-unidades',
  templateUrl: './cat-unidades.component.html',
  styleUrl: './cat-unidades.component.css'
})
export class CatUnidadesComponent implements OnInit{

  constructor(
    private unidades : UnidadesService
  ){}

  ngOnInit(): void {
    this.getCatVehiculos();  
  }

  datosFiltrados:any[] = [];
  private ordenador!: FuncionesTablas<any>;
  busqueda:string = '';

  public data:any;
  public modalAbierto:boolean = false;
  public isLoad:boolean = false;

  ordenarPor(columna: keyof any){
    this.datosFiltrados = this.ordenador.ordenar(columna);
  }

  getIconoOrden(columna:keyof any):string{
    return this.ordenador.getIcono(columna)
  }

  filtrarTabla(){
    this.datosFiltrados = this.ordenador.filtrar(this.busqueda, [
      'entidad', 'marca_vehiculo', 'submarca', 
      'modelo', 'no_serie', 'placas',
      'marca_tanque', 'anio_fabricacion', 'capacidad',
      'tipo_medidor', 'serie',
    ]);
    this.contarDatos();
  }

  public totalDatos:any;
  public totalDatosFiltrados:any;
  contarDatos(){

    this.totalDatosFiltrados = this.datosFiltrados.length
    this.totalDatos = this.data.length 
    
  }

  private getCatVehiculos() {
    this.isLoad = true;
    this.unidades.getVehiculos().subscribe(
      (response) => {
        if (response) {
          this.data = response.data;

          this.ordenador = new FuncionesTablas(this.data);
          this.datosFiltrados = [...this.data];

          // console.table(this.datosFiltrados);
          this.contarDatos();
          this.isLoad = false;
          // this.showTable = true;
          
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
      }
    );
  }
}
