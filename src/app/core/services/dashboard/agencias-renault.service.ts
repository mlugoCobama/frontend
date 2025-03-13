import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AgenciasRenaultService {
  constructor(private http: HttpClient) {}

  /**
   * Recupera los datos de las agencias Renault
   * @param mes
   * @param anio
   */
  public getAgencias(mes: number, anio: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + "agencia-renault/" + mes + "/" + anio
    );
  }

  /**
   * Guarda datos de las agencias Renault.
   * \captura-mensual\captura-agencias-renault\captura-agencias-renault.component.ts
   * @param data datos obtenidos de tabla datos.
   */
  public save(data: any): Observable<any> {
    return this.http.post(
      environment.apiUrl + "dashboard/agencia-renault",
      data
    );
  }

  /**
   * Actualiza datos de las agencias Renault.
   * \captura-mensual\captura-agencias-renault\captura-agencias-renault.component.ts
   * @param data datos obtenidos de tabla datos.
   */
  public update(data: any): Observable<any> {
    return this.http.put(
      environment.apiUrl + "dashboard/edit-agencia-renault",
      data
    );
  }

  /**
   * Consulta el mes
   * \captura-mensual\captura-agencias-renault\captura-agencias-renault.component.ts
   * @param mes mes de consulta
   * @param anio
   * @returns array formateado
   */
  public getMesAgencias(mes: number, anio: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + "show-agencia-renault/" + mes + "/" + anio
    );
  }
}
