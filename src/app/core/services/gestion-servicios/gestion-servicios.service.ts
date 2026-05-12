import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BehaviorSubject } from 'rxjs';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});


@Injectable({
  providedIn: 'root'
})

export class GestionServiciosService {

  constructor(private http: HttpClient) { }

  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios", {headers});
  }

  public getCatServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/cat-servicios", {headers});
  }

  public storeServicio(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + "ucoip/servicios", data, {headers});
  }

  public getPagoServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/servicios", {headers});
  }

  public getServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/servicios/1", {headers});
  }

  // public getProveedoresServicios(): Observable<any> {
  //   return this.http.get(environment.apiUrl + "compras/Usuarios", {headers});
  // }

}
