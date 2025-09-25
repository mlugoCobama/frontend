import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

/**
 * Recupera el catalogo de empresas
 * @returns coleccion empresas {nombre, intercompania}
 */
  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios", {headers});
  }
  
  /**
   * Recupera un colección de usuarios por num intercompaia
   * @param intercompania num intercompania de la empresa
   * @returns colección de usuarios por su num intercompania
   */
  public getUsuariosEmpresas(intercompania: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/Usuarios/${intercompania}`, {headers}
    );
  }

  /**
   * Recupera los datos del unario solicitado
   * @param correo correo del usuario
   * @returns datos del usuario del intranet
   */
  public getUserById(correo: string): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/getUserByEmail/${correo}`, {headers}
    );
  }
}
