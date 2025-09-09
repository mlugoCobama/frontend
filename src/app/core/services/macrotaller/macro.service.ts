import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor(  private http: HttpClient  ) { }

  /**
   * Recupera el catalogo de gaseras 
   * @returns catalogo de gaseras
   */

  public getGaseras(): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-gaseras`);
  }

  /**
   * Recupera un catalogo de compras con disponibilidad para ingreso a almacen
   * @param intercompania numero de intercompania de la gasera
   * @returns compras marcadas como autorizadas o superior 
   */
  public getCompras(intercompania: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-compra/${intercompania}`);
  }

  /**
   * Recupera un catalogo de compras con disponibilidad para ingreso a almacen
   * @param intercompania numero de intercompania de la gasera
   * @returns compras marcadas como autorizadas o superior 
   */
  public getComprasAlmacenadas(intercompania: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-compras-almacenadas/${intercompania}`);
  }

  /**
   * Recupera todos los datos de técnicos
   * @returns colección con el catalogo de técnicos
   */
  public getTecnicos(): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/tecnico`);
    }

/**
 * Recupera una lista de detalles por solicitu de compra
 * @param idSolicitud id de la solicitud de compra a recuperar
 * @returns detalles de la solicitud sin ingresar al almacen 
 */
  public getDetalleEntrada(idSolicitud: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/almacen/${idSolicitud}`);
  }

  /**
   * Recupera detalles en almacen que tienen existencia
   * @param idSolicitud id de solicitud o de autotanque 
   * @param tipo tipo de busqueda
   * @returns lista de detalles disponibles en el almacen 
   */
  public getDetalleSalida(idSolicitud: number, tipo: any): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/almacen-activo/${tipo}/${idSolicitud}`);
  }

}
