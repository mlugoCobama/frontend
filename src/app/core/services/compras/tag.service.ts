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

export class TagService {

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Tags`, {headers});
  }

  public getTagsDisponibles(id:any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Tags/${id}`, {headers});
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/Tags/`,data, {headers});
  }

  public destroy(id:any): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/Tags/${id}`, {headers});
  }

}
