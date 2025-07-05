import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DetallesSolicitudService {

  constructor(private http: HttpClient) {

   }

  public edit(id: number, data: any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/DetallesSolicitud/${id}`, data);
  }

  public getOne(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/DetallesSolicitud/${id}`);
  }


}
