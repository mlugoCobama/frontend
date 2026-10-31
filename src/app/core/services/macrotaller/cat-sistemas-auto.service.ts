import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CatSistemasAutoService {

  constructor(private http: HttpClient) { }

  /**
   * Recupera los registros de catalogo_sistemas_auto
   * @returns colección de sistemas de autos
   */
  public getAll(tipo: any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/CatalogoSistemasAuto/${tipo}`);
  }

   /**
   * Recupera los registros de tipos de mantenimiento
   * @returns tipos de mantenimiento
   */
  public getTiposMantenimiento(tipo : any): Observable<any> {
    return this.http.get(environment.apiUrl +  `compras/CatalogoTiposMantenimiento/${tipo}`);
  }
}
