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
export class CatSistemasAutoService {

  constructor(private http: HttpClient) { }

  /**
   * Recupera los registros de catalogo_sistemas_auto
   * @returns colección de sistemas de autos
   */
  public getAll(tipo: any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoSistemasAuto/${tipo}`, {headers});
  } 

   /**
   * Recupera los registros de tipos de mantenimiento
   * @returns tipos de mantenimiento
   */
  public getTiposMantenimiento(tipo : any): Observable<any> {
    return this.http.get(environment.apiUrl +  `compras/CatalogoTiposMantenimiento/${tipo}`, {headers});
  } 
}
