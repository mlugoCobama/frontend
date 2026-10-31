import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class TokaService {


  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Toka`);
  }

  public getTarjetasEmpresa(intercompania:any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/Toka/${intercompania}`);
  }

  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/Toka/`,data);
  }

  public destroy(id:any): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/Toka/${id}`);
  }

}
