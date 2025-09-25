import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

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
    return this.http.get<any>(environment.apiUrl + "capacitaciones/adminstracion", {headers});
  }

  public getAllModulos(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "capacitaciones/modulos", {headers});
  }

  public getFunciones(nModulo, nSubmodulo): Observable<any> {
    return this.http.get<any>(
      environment.apiUrl +
        `capacitaciones/getFunciones/${nModulo}/${nSubmodulo}`, {headers}
    );
  }

  public getPuestos(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + "capacitaciones/puestos" , {headers});
  }

  /**
   * Recupera el catalogo de empresas
   */
  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios", {headers});
  }

  /**
   * Recupera un colección de usuarios por num intercompaia
   */
  public getUsuariosEmpresas(intercompania: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/Usuarios/${intercompania}`, {headers}
    );
  }

  public save(data:any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'capacitaciones/adminstracion', data, {headers});
  }

  public destroy( id : number): Observable<any> {
      return this.http.delete(environment.apiUrl + `capacitaciones/adminstracion/${id}`, {headers});
    }
}
