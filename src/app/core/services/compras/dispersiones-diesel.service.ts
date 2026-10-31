import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class DispersionesDieselService {

  constructor(private http: HttpClient) {}
  /**
   * Recupera todas las sipersiones pendientes y realizadas
   * @returns
   */
  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/DispersionesDiesel`);
  }

  public getOne(id:any): Observable<any> {
    return this.http.get(environment.apiUrl + `compras/DispersionesDiesel/${id}`);
  }

  public notificarDispersion(payload:any): Observable<any> {
    return this.http.post(environment.apiUrl + `compras/CatalogoUnidades/NotificarDispersion`, payload);
  }

  descargarPlantilla(id:any, numDispersion: number): Observable<Blob> {
    return this.http.get(environment.apiUrl +'compras/DispersionesDiesel/Plantilla/'+id+'/'+numDispersion,
      {
        responseType: 'blob'
      }
    );
  }

}
