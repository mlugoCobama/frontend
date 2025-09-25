import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

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
    public getVehiculos(intercompania: number): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/CatalogoUnidades/${intercompania}`, {headers});
    }

    public save(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + `compras/CatalogoUnidades`, data, {headers});
    }

    public update( id : number ,data: any): Observable<any> {
      return this.http.put(environment.apiUrl + `compras/CatalogoUnidades/${id}`, data, {headers});
    }

    public delete( id : number): Observable<any> {
      return this.http.delete(environment.apiUrl + `compras/CatalogoUnidades/${id}`, {headers});
    }

    public getGastosVehiculo(id: number): Observable<any> {
      return this.http.get(environment.apiUrl + `compras/recuperar-gastos-vehiculo/${id}`, {headers});
    }



}
