import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: "root",
})
export class AdministracionService {
  constructor(private http: HttpClient) {}

  /**
   * Recupera el catalogo de modulos
   * @returns catalogo de modulos
   */
  public getAll(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "capacitaciones/adminstracion");
  }

  public getAllModulos(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "capacitaciones/modulos");
  }

  public getFunciones(nModulo, nSubmodulo): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl +
        `capacitaciones/getFunciones/${nModulo}/${nSubmodulo}`
    );
  }

  public getPuestos(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "capacitaciones/puestos" );
  }

  /**
   * Recupera el catalogo de empresas
   */
  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios");
  }

  /**
   * Recupera un colección de usuarios por num intercompaia
   */
  public getUsuariosEmpresas(intercompania: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/Usuarios/${intercompania}`
    );
  }

  public save(data:any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'capacitaciones/adminstracion', data);
  }

  public destroy( id : number): Observable<any> {
      return this.http.delete(environment.apiUrl + `capacitaciones/adminstracion/${id}`);
    }
}
