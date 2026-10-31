import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class GestionServiciosService {

  constructor(private http: HttpClient) { }

  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios");
  }

  public getCatServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/cat-servicios");
  }

  public storeServicio(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + "ucoip/servicios", data);
  }

  public getPagoServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/servicios");
  }

  public getServicios(): Observable<any> {
    return this.http.get(environment.apiUrl + "ucoip/servicios/1");
  }

  // public getProveedoresServicios(): Observable<any> {
  //   return this.http.get(environment.apiUrl + "compras/Usuarios");
  // }

}
