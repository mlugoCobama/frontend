import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlmacenProductosService {

  constructor(private http: HttpClient) {}

  public getExistencias(id:any = ''): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/AlmacenProductos/${id}`);
  }

  public getExistenciaFiltro(payload:any): Observable<any>{
    return this.http.post(environment.apiUrl + `compras/AlmacenProductos/Existencias/Filtro`, payload);
  }

  public store( payload:any ): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/AlmacenProductos`, payload);
  }

  public subirAcuse( payload:FormData ): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/AlmacenProductos/Salidas/Subir/Acuse`, payload);
  }

  public getMovimientosProducto(idProducto:any, almacen:any): Observable<any>{

    const payload = {idProducto: idProducto, almacen:almacen };
    return this.http.post(environment.apiUrl + `compras/AlmacenProductos/Movimientos`, payload);
  }

    /**
     * Petición para generar el formato de orden compra
     * @param id solicitud_compra_id
     * @returns pdf en binario
     */
    pdfEntregaInsumos(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(environment.apiUrl + `compras/AlmacenProductos/Salida/Formato/${id}`, {
      responseType: "blob",
      observe: "response"
    });
  }

    /**
   * Abre un blank con el documento seleccionado
   * @param rutaArchivo ruta al archivo del documento
   */
  public abrirArchivo(rutaArchivo: string){
    const url =  (environment.apiArchivos + `compras/${rutaArchivo}`);
     window.open(url , '_blank')
  }
}
