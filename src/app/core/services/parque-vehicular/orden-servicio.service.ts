import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioService {

  private http =  inject(HttpClient);

  constructor() { }

  public getOne( id: number): Observable<any>  {
    return this.http.get<any>(`${environment.apiUrl}parque-vehicular/vehiculos-proveedores/${id}`);
  }

  public autorizar(data:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}parque-vehicular/vehiculos-proveedores/autorizacion`, data)
  }

  public finalizar(data:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}parque-vehicular/vehiculos-proveedores/finalizar`, data)
  }

}
