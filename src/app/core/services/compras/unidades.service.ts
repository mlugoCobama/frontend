import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

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
      return this.http.get(environment.apiUrl + `compras/CatalogoUnidades/${intercompania}`);
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




}
