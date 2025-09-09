import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TecnicosService {
  constructor(private http: HttpClient) {}

  /**
   * Recupera todos los datos de técnicos
   * @returns colección con el catalogo de técnicos
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `macrotaller/tecnico`);
  }

  /**
   * Almacena los datos del técnico
   * @param data
   * @returns
   */
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "macrotaller/tecnico", data);
  }

  /**
   * Marca como eliminado el registro de técnico
   * @param id id del técnico
   * @returns 
   */
  public destroy(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `macrotaller/tecnico/${id}`);
  }
}
