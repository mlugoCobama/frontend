import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(  private http: HttpClient  ) { }
    /**
     * Almacena los datos de la entrada a almacén
     * @param data 
     * @returns 
     */
    public save(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + 'macrotaller/almacen', data);
    }

    public saveSalida(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + 'macrotaller/salida-almacen', data);
    }

    public getAlmacen(): Observable<any> {
      return this.http.get(environment.apiUrl + `macrotaller/almacen`);
    }

    
}
