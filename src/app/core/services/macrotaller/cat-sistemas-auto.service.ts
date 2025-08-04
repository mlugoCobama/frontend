import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatSistemasAutoService {

  constructor(private http: HttpClient) { 

  }

  /**
   * Recupera los registros de catalogo_sistemas_auto
   * @returns colección de sistemas de autos
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/CatalogoSistemasAuto');
  } 

  public getTiposMantenimiento(): Observable<any> {
    return this.http.get(environment.apiUrl + 'compras/CatalogoTiposMantenimiento');
  } 
}
