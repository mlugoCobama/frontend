import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenciasService {

    constructor(
      private http: HttpClient,
    ) {}
    /**
     * Recupera los datos de las agencias Nissan
     * @param mes 
     * @param anio 
     * @returns 
     */
    public getAgencias(mes: number, anio: number) : Observable<any> {
      return this.http.get(environment.apiUrl + 'agencia-nissan/' + mes + '/' + anio);
    }
}
