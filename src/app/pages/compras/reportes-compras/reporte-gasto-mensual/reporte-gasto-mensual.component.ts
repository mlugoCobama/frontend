import { Component } from "@angular/core";
import { dA } from "@fullcalendar/core/internal-common";
import { ReportesComprasService } from "src/app/core/services/compras/reportes-compras.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-reporte-gasto-mensual",
  templateUrl: "./reporte-gasto-mensual.component.html",
  styleUrl: "./reporte-gasto-mensual.component.css",
})
export class ReporteGastoMensualComponent {
  public data: any;
  public dataDetalle: any;
  public params: any;
  public isLoad: boolean = false;
  public isLoadDeatil: boolean = false;
  public showContent: boolean = false;
  public showContentDetail: boolean = false;
  public mostrar:boolean = false;
  public nameEmpresa: any = '';
  public intercompania: any = '';
  public isDownloadingConcentrado: boolean = false;
  public isDownloadingDetalle: boolean = false;
  public isFetchingConcentrado = false;
  public modalAbierto: boolean = false;
  public tiposCompras = ['Compras Generales', 'Compras Macro Taller', 'Compras Recursos Tecnologicos'];

  constructor(private reportesCompras: ReportesComprasService) {}

  private getConcentrado(fechaInicial, fechaFinal, tipo) {
    this.isFetchingConcentrado = true;
    this.showContent = true;
    this.isLoad = false
    this.isLoadDeatil = false;
    this.showContentDetail = false;
    this.reportesCompras
      .getComprasConcentrado(fechaInicial, fechaFinal, +tipo)
      .subscribe(
        (response: any) => {
          if (response) {
            this.data = response.data;
            this.isLoad = this.data.length > 0;
            this.isFetchingConcentrado = false;
          } else {
            this.isLoad = true
            console.log(response.message);
          }
        },
        (error) => {
          this.isLoad = true
          this.isFetchingConcentrado = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener datos',
            text: 'Ocurrió un error al consultar el concentrado. Intenta nuevamente.',
          });
          console.error("Error fetching data:", error);

        }
      );
  }

  public getDetalleIntercompania(data){
    this.nameEmpresa = data.empresa;
    this.intercompania = data.intercompania
    console.log(this.intercompania)
    this.getDetalle(data.intercompania, this.params.fechaInicial, this.params.fechaFinal, this.params.tipo )
    
  }

  private getDetalle(intercompania, fechaInicial, fechaFinal, tipo) {
    this.showContentDetail = true;
    this.isLoadDeatil = false
    this.reportesCompras
      .getComprasDetalle(intercompania, fechaInicial, fechaFinal, +tipo)
      .subscribe(
        (response: any) => {
          if (response) {
            this.dataDetalle = response.data;
            console.log(this.dataDetalle)
            this.isLoadDeatil = this.dataDetalle.length > 0 ? true : false;
          } else { 
            this.isLoadDeatil = false
            console.log(response.message);
          }
        },
        (error) => {
          this.isLoadDeatil = false
          console.error("Error fetching data:", error);
        }
      );
  }

  recibirDatos(datos: any) {
    this.params =  datos;
    this.getConcentrado(datos.fechaInicial, datos.fechaFinal, datos.tipo);
  }

  
  descargarConcentrado() {
  this.isDownloadingConcentrado = true;

  this.reportesCompras.descargarConcentrado(this.params.fechaInicial, this.params.fechaFinal, this.params.tipo)
    .subscribe({
      next: (archivo: Blob) => {
        this.descargarArchivo(archivo, `Concentrado_${this.params.fechaInicial}_${this.params.fechaFinal}_${this.tiposCompras[+this.params.tipo - 1]}.xlsx`);
        this.isDownloadingConcentrado = false;
      },
      error: (err) => {
        this.isDownloadingConcentrado = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al descargar',
          text: 'No se pudo descargar el concentrado. Intenta después.',
        });
      }
    });
}

descargarDetalle(intercompania: string) {
  this.isDownloadingDetalle = true;

  this.reportesCompras.descargarDetalleEmpresa(intercompania, this.params.fechaInicial, this.params.fechaFinal, this.params.tipo)
    .subscribe({
      next: (archivo: Blob) => {
        this.descargarArchivo(archivo, `Detalle_${this.nameEmpresa}_${this.params.fechaInicial}_${this.params.fechaFinal}_${this.tiposCompras[+this.params.tipo - 1]}.xlsx`);
        this.isDownloadingDetalle = false;
      },
      error: (err) => {
        this.isDownloadingDetalle = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al descargar',
          text: `No se pudo descargar el detalle de ${this.nameEmpresa}. Intenta después.`,
        });
      }
    });
}



  private descargarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = nombre;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  isOpenModal(dato){
    this.modalAbierto = dato;
  }
}
