import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokensAgenciasService {

  private endpoint = environment.apiUrl + 'ucoip/tokens-agencias';

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtiene el listado de tokens de agencias
   */
  public getAll(): Observable<any> {
    return this.http.get<any>(this.endpoint);
  }

  /**
   * Guarda un nuevo token
   */
  public save(data: any): Observable<any> {
    return this.http.post<any>(this.endpoint, data);
  }

  /**
   * Actualiza un token existente
   */
  public update(data: any): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/${data.id}`, data);
  }

  /**
   * Obtiene un token por su id
   */
  public getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${id}`);
  }

  /**
   * Cambia el estado (activo/inactivo)
   */
  public changeStatus(id: number): Observable<any> {
    return this.http.patch<any>(`${this.endpoint}/${id}/status`, {});
  }

  /**
   * Elimina un token (si manejas eliminación física)
   */
  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }

}