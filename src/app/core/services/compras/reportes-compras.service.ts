import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ReportesComprasService {

  constructor(private http: HttpClient) {}

  getReportFile(tipo:any, status:any, fechaInicial:any, fechaFinal:any ){
    const url = `${environment.apiUrl}compras/download/SolicutdesCompras/${tipo}/${status}/${fechaInicial}/${fechaFinal}`;
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    });
  }
  
  private tipoMap: { [key: number]: string } = {
    1: 'compras_grales',
    2: 'compras_macro',
    3: 'compras_rt',
    4: 'compras_autos'
  };

  downloadBlob(response: HttpResponse<Blob>, tipo: number, status: any): void {
    const hoy = new Date();
    const dia   = String(hoy.getDate()).padStart(2, '0');
    const mes   = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio  = String(hoy.getFullYear());
    const fechaStr = `${dia}_${mes}_${anio}`;

    const tipoTexto = this.tipoMap[tipo] || `tipo_${tipo}`;
    let filename = 'reporte.xlsx'
    
    switch (status) {
      case 'all':
        filename = `GastoGeneralConcentrado_${tipoTexto}_al_${fechaStr}.xlsx`;
        break;
      case 'seg':
        filename = `SeguimientoCompras_${tipoTexto}_al_${fechaStr}.xlsx`;
        break;
    
      default:
        filename = `SC_${fechaStr}_${status}_${tipoTexto}.xlsx`
        break;
    }

    const blob = response.body;
    if (!blob) {
      console.error('El blob del archivo es nulo');
      return;
    }

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    a.remove();
  }

  getComprasConcentrado(fechaInicial:any, fechaFinal:any, tipo:any){
    return this.http.get<any>( `${environment.apiUrl}compras/ReportesCompras/GatoMensualConcentrado/${fechaInicial}/${fechaFinal}/${tipo}`);
  }

  getComprasDetalle(intercompania:any ,fechaInicial:any, fechaFinal:any, tipo:any){
    return this.http.get<any>( `${environment.apiUrl}compras/ReportesCompras/GatoMensualDetalle/${intercompania}/${fechaInicial}/${fechaFinal}/${tipo}`);
  }

  descargarConcentrado(fechaInicial: string, fechaFinal: string, tipo: number) {
    return this.http.get(`${environment.apiUrl}compras/reportes/gastos/concentrado`, {
      params: { fechaInicial, fechaFinal, tipo },
      responseType: 'blob' 
    });
  }

  descargarDetalleEmpresa(intercompania: string, fechaInicial: string, fechaFinal: string, tipo: number) {
    return this.http.get(`${environment.apiUrl}compras/reportes/gastos/detalle/${intercompania}`, {
      params: { fechaInicial, fechaFinal, tipo },
      responseType: 'blob'
    });
  }

}
