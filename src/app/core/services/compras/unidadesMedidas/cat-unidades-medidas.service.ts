import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadMedida, ResponseUnidadMedida } from 'src/app/core/models/compras/unidad-medida';

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
    return this.http.get<ResponseUnidadMedida>(environment.apiUrl + 'compras/CatalogoUnidadesMedida');
  } 

  /**
   * recupera un registro en especifico
   * @param id id del registro seccionado
   * @returns 
   */
  public getOne(id:number): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`);
  }
  /**
   * Almacena los datos de la unida de medida
   * @param data nombre, abreviatura
   * @returns 
   */
  public save(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'compras/CatalogoUnidadesMedida', data);
  }
/**
   * Actualiza los datos de la unida de medida
   * @param id id del registro seccionado
   * @param data nombre, abreviatura
   * @returns 
   */
  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`, data);
  }
  /**
   * borra un registro en especifico
   * @param id id del registro seccionado
   * @returns 
   */
  public destroy(id:number): Observable<any> {
    return this.http.delete(environment.apiUrl + `compras/CatalogoUnidadesMedida/${id}`);
  }
}
