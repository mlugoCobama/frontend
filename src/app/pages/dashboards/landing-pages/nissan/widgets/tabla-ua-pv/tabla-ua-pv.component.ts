import { Component, AfterViewInit, Input } from '@angular/core';
import { LocalStorageServiceService } from 'src/app/core/services/local-storage-service.service';
import { AgenciasService } from 'src/app/core/services/dashboard/agencias.service';
import { EnergeticosGaserasService } from 'src/app/core/services/dashboard/energeticos-gaseras.service';
import { ResponseAgenciasNissan} from 'src/app/core/models/dashboard/agencias-nissan';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ModalDetallePvComponent } from '../modal-ua-pvs/modal-detalle-pv/modal-detalle-pv.component';
import { Subject, Subscription } from "rxjs";

@Component({
  selector: 'app-tabla-ua-pv',
  templateUrl: './tabla-ua-pv.component.html',
  styleUrl: './tabla-ua-pv.component.css'
})
export class TablaUaPvComponent implements AfterViewInit {

  public dataEnergeticos:any;
  public copiaData:any;
  public mes : any;
  public mesAnt: any;
  public anioAnt: any;

  public totalMes:any;
  public totalMesAnt:any;
  public totalAnioAnt:any;

  public pvs:any;
  public areas:any;

  /**
   * Datos que se muestran en la tabla
   */
  public datos:any; 
  @Input() concepto:any;

  public modalRef?: BsModalRef;

  public isLoad: boolean = false;

   private actualizarDatosSubscripcion: Subscription;


  constructor(
    private localStorage: LocalStorageServiceService,
    private gaseras: EnergeticosGaserasService,
    private agencias :  AgenciasService,
    private modalService: BsModalService,
  ){}

  ngAfterViewInit(): void {
    this.asignarAreas();
    this.getDataUaPvs();
    this.actualizarDatosSubscripcion =
    this.gaseras.actualizarData$.subscribe(() => {
      this.getDataUaPvs();
    });
  }

  /**
   * Recupera el mes actual del local storage y obtiene la fecha del periodo actual
   * @returns fecha del periodo almacenado en el localStorage
   */
  private recuperarFechaLocalStorage(){
    this.dataEnergeticos = this.localStorage.getItem('DataEnergeticos');
    this.copiaData = this.dataEnergeticos;
    let referencia = this.dataEnergeticos['mes'].find((regsitro) => regsitro.estacion !=  'Total' )
    let fecha =  referencia.fecha.split('-');
    return fecha;
  }

  /**
   *  Asigna sub-conceptos dependiendo el area que se esta obteniendo
   */
  private asignarAreas(){
  const asComercial = ['area_nuevos', 'area_flotillas', 'area_seminuevos'];
  const asPostVenta= ['area_servicio', 'area_refacciones', 'area_hyp'];
  this.areas = this.concepto === 'area_comercial' ? asComercial : asPostVenta;
  }

  /**
   * Calcula las sumas de la tabla
   */
  public calcularSumas(){
    let totales = [];
    // Mapeo del mes para recuperar pvs y ids
    this.pvs = this.mes.filter((fila) => fila.estacion != 'Total').map(objeto => ({id : objeto.id , estacion : objeto.estacion}));


     for (let i = 0; i < this.pvs.length; i++) {

      const id = this.pvs[i].id;
      const pv = this.pvs[i].estacion;
      //Suma total del conjunto de sub areas: Suma = area a + area b + area c
      const sumaMes = [Number(this.mes[i][this.areas[0]] ?? 0),Number(this.mes[i][this.areas[1]] ?? 0),Number(this.mes[i][this.areas[2]] ?? 0)].reduce(function (a,b) {return a + b;});
      const sumaMesAnt = [Number(this.mesAnt[i][this.areas[0]] ?? 0),Number(this.mesAnt[i][this.areas[1]] ?? 0),Number(this.mesAnt[i][this.areas[2]] ?? 0)].reduce(function (a,b) {return a + b;});
      const sumaAnioAnt = [Number(this.anioAnt[i][this.areas[0]] ?? 0),Number(this.anioAnt[i][this.areas[1]] ?? 0), Number(this.anioAnt[i][this.areas[2]] ?? 0)].reduce(function (a,b) {return a + b;});

      if(sumaMes != 0 || sumaMesAnt != 0 || sumaAnioAnt != 0){
        // Estructura de cada fila
        totales.push({id: id ,pv:pv, mes:sumaMes, mesAnt:sumaMesAnt, anioAnt:sumaAnioAnt})
      };
    }
    this.datos = totales;
    
    this.calcularSumasTotales(this.datos);
  }

  /**
   * Calcula las sumas totales de mes de la tabla
   */
  private calcularSumasTotales(datos){
    let totalMes = [];
    let totalMesAnt = [];
    let totalAnioAnt = [];

    datos.forEach(fila => {
      totalMes.push(fila.mes)
      totalMesAnt.push(fila.mesAnt)
      totalAnioAnt.push(fila.anioAnt)
    });

    this.totalMes = totalMes.reduce(function (a,b) {return a + b;});
    this.totalMesAnt = totalMesAnt.reduce(function (a,b) {return a + b;});
    this.totalAnioAnt = totalAnioAnt.reduce(function (a,b) {return a + b;});
  }

  public getDataUaPvs(){
    const fecha = this.recuperarFechaLocalStorage();
    this.agencias.getMesUaPvs(fecha[1], fecha[2], 3).subscribe(
      (response => {
        const datos =  response.data;
        this.mes = datos.mes;
        this.mesAnt =  datos.mesAnt;
        this.anioAnt =  datos.anioAnt;
        this.calcularSumas();
        this.isLoad = true;
      })
    )
 }

  public anio:any;
  public dataEstacion
  private sutituirDataAnual(id, anio){

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

  public openModalNuevo(agencia, id) {
    const mes = this.dataEnergeticos['mes'].find((registro) => registro.id != "Total");
    const periodo =  mes.fecha.split("-");
    let anio = periodo[2];
    this.sutituirDataAnual(id, anio);
       const initialState: ModalOptions = {
         initialState: {
          agencia: agencia,
          id: id,
          concepto: this.concepto,
          mes: this.mes,
          mesAnt:this.mesAnt,
          anioAnt: this.anioAnt
         },
         class: "modal-lg",
       };
       this.modalRef = this.modalService.show(ModalDetallePvComponent, initialState);
       this.modalRef.content.closeBtnName = "Close";
      this.modalRef.content.event.subscribe(() => {
        
      });
  }

}
