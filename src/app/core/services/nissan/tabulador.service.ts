import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TabuladorService {

  constructor(private http: HttpClient) { }

  /** Recupera todos los registros de tipo de ventas */
  public getAll(){
    return this.http.get<any>(environment.apiUrl + `nissan/tipo-venta`);
  }

  /** Almacena un registro de un tipo de venta*/
  public store(data:any){
    return this.http.post<any>(environment.apiUrl + `nissan/tipo-venta`, data);
  }

  /** Actualiza un registro de un tipo de venta*/
  public update(id:any, data:any){
    return this.http.put<any>(environment.apiUrl + `nissan/tipo-venta/${id}`, data);
  }

  /** Borra un registro de un tipo de venta*/
  public delete(id:any){
    return this.http.delete<any>(environment.apiUrl + `nissan/tipo-venta/${id}`);
  }
}
