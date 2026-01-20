import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendedoresService {

  constructor(private http: HttpClient) { 
    
  }

  /** Recupera todos los registros de vendedores */
  public getAll(){
    return this.http.get<any>(environment.apiUrl + `nissan/vendedor`);
  }

  /** Recupera todos los registros de vendedores de una agencia en especifico */
  public getOne(id){
    return this.http.get<any>(environment.apiUrl + `nissan/vendedor/${id}`);
  }

  /** Almacena un registro de un vendedor */
  public store(data){
    return this.http.post<any>(environment.apiUrl + `nissan/vendedor`, data);
  }

  /** Actualiza un registro de un vendedor */
  public update(id, data){
    return this.http.put<any>(environment.apiUrl + `nissan/vendedor/${id}`, data);
  }

  /** Borra un registro de un vendedor */
  public delete(id){
    return this.http.delete<any>(environment.apiUrl + `nissan/vendedor/${id}`);
  }

}
