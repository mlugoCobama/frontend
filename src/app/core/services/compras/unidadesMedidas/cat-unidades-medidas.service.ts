import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadMedida, ResponseUnidadMedida } from 'src/app/core/models/compras/unidad-medida';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: 'root'
})
export class CatUnidadesMedidasService {

  constructor(private http: HttpClient) { }

  /**
   * Recupera los registros de cat_unidades_medida
   * @returns coleccion de unidades de medidas
   */
  public getAll(): Observable<ResponseUnidadMedida> {
    return this.http.get<ResponseUnidadMedida>(environment.apiUrl + 'compras/CatalogoUnidadesMedida', {headers});
  } 

  /**
   * recupera un registro en especifico
   * @param id id del registro seccionado
   * @returns 
   */
  public getOne(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`, {headers});
  }
  /**
   * Almacena los datos de la unida de medida
   * @param data nombre, abreviatura
   * @returns 
   */
  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/CatalogoUnidadesMedida', data, {headers});
  }
/**
   * Actualiza los datos de la unida de medida
   * @param id id del registro seccionado
   * @param data nombre, abreviatura
   * @returns 
   */
  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`, data, {headers});
  }
  /**
   * borra un registro en especifico
   * @param id id del registro seccionado
   * @returns 
   */
  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`, {headers});
  }
}
