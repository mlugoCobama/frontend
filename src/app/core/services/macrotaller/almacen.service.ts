import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: "root",
})
export class AlmacenService {
  constructor(private http: HttpClient) {}
  /**
   * Almacena los datos de la entrada a almacén
   * @param data
   * @returns
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "macrotaller/almacen", data, {headers});
  }

  /**
   * Almacena los datos de salida de almacén
   * @param data
   * @returns
   */
  public saveSalida(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "macrotaller/salida-almacen",
      data, {headers}
    );
  }

  /**
   * Recupera los datos del almacén
   * @returns data almacen
   */
  public getAlmacen(): Observable<any> {
    return this.http.get(environment.apiUrl + `macrotaller/almacen`, {headers});
  }
}
