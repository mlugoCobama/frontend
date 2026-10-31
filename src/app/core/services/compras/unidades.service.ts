import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { data } from 'jquery';


@Injectable({
  providedIn: 'root'
})
export class UnidadesService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Recupera el catalogo de vehículos
   * @returns colección vehículos
   */
    public getVehiculos(intercompania: number, tipo:string = 'reparto' ): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/CatalogoUnidades/${intercompania}/${tipo}`);
    }

    public save(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/CatalogoUnidades`, data);
    }

    public update( id : number ,data: any): Observable<any> {
      return this.http.put(environment.apiUrl + `compras/CatalogoUnidades/${id}`, data);
    }

    public delete( id : number): Observable<any> {
      return this.http.delete(environment.apiUrl + `compras/CatalogoUnidades/${id}`);
    }

    public getGastosVehiculo(id: number): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/recuperar-gastos-vehiculo/${id}`);
    }

    public getComentarios(id: number): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/recuperar-comentarios-vehiculo/${id}`);
    }

    public getPolizas(id: number): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/recuperar-polizas-vehiculo/${id}`);
    }

    public autorizarVehiculo(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/autorizar-alta-vehiculo`, data);
    }

    public solicitarToka(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/CatalogoUnidades/SolicitaToka`, data);
    }

    public dispersarToka(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/CatalogoUnidades/DispersaToka`, data);
    }

    public getParqueConToka(id:any): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/CatalogoUnidades/ParqueVehicularToka/${id}`);
    }

    descargarGastosUnidad(idVehiculo: number) {
    return this.http.get(
      `${environment.apiUrl}compras/descargar-gastos-vehiculo/${idVehiculo}`,
      {
        responseType: 'blob',
        // observe: 'response'
      }
    );
  }



}
