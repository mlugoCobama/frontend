import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http: HttpClient) {}
  /**
   * Recupera todas las compras de ti
   * @returns
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/AlmacenCompras`, {headers});
  }

  /**
   * Recupera los técnicos de ti
   * @returns
   */
  public getTecnicosTi(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/getTecnicos`, {headers});
  }

  /**
   * Recupera los técnicos de ti
   * @returns
   */
  public getExistencias(): Observable<any> {
    
    return this.http.get(environment.apiUrl + `compras/getExsitencias/3`, {headers});
  }

  public getMovimientos(): Observable<any> {
    
    return this.http.get(environment.apiUrl + `compras/getMovimientos`, {headers});
  }

  public storeMovimientos(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/AlmacenCompras`, data,{headers});
  }
}
