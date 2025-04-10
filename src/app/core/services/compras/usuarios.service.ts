import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  public getEmpresas(): Observable<any> {
    return this.http.get(environment.apiUrl + "compras/Usuarios");
  }

  public getUsuariosEmpresas(intercompania: number): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/Usuarios/${intercompania}`
    );
  }

  public getUserById(correo: string): Observable<any> {
    return this.http.get(
      environment.apiUrl + `compras/getUserByEmail/${correo}`
    );
  }
}
