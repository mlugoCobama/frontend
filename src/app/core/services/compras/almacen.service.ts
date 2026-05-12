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
}
