import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MacroService {

  constructor(  private http: HttpClient  ) { }

  public getGaseras(): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-gaseras`);
  }

  public getCompras(intercompania: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-compra/${intercompania}`);
  }

  public getComprasAlmacenadas(intercompania: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/get-compras-almacenadas/${intercompania}`);
  }

  public getTecnicos(): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/tecnico`);
    }

  public getDetalleEntrada(idSolicitud: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/almacen/${idSolicitud}`);
  }

  public getDetalleSalida(idSolicitud: number): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/almacen-activo/${idSolicitud}`);
  }

}
