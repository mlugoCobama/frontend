import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEnergeticosGaseras } from '../../models/dashboard/energeticos-gaseras';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergeticosGasolinerasService {

  constructor(
    private http: HttpClient,
  ) {}

    /**
   * Recupera los datos del mes gasolinera
   * @param mes 
   * @param anio 
   */
    public getGasolinerias(mes: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
      return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-gasolineras/' + mes + '/' + anio);
    }

    /**
     * Crea o actualiza registros en 'datos_generales'
     * @param data 
     * @returns 
     */
    public save(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + "dashboard/gasolinerias", data);
    } 
}
