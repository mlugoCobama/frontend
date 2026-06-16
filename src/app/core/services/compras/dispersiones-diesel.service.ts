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
export class DispersionesDieselService {

  constructor(private http: HttpClient) {}
  /**
   * Recupera todas las sipersiones pendientes y realizadas
   * @returns
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/DispersionesDiesel`, {headers});
  }

  public getOne(id:any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/DispersionesDiesel/${id}`, {headers});
  }

  descargarPlantilla(id:any): Observable<Blob> {
    return this.http.get(environment.apiUrl +'compras/DispersionesDiesel/Plantilla/'+id,
      {
        headers: headers, 
        responseType: 'blob'
      }
    );
  }

}