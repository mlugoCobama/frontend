import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEnergeticosGaseras } from '../../models/dashboard/energeticos-gaseras';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergeticosGaserasService {

  constructor(
    private http: HttpClient,
  ) {}
  /**
    * Recupera los datos del mes gaseras
   * @param mes 
   * @param anio 
   * @returns 
   */
  public get(mes: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-gaseras/' + mes + '/' + anio);
  }

  public getAnual(id_subdivision: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos/' + id_subdivision);
  }

  public getAnualSubDivision(id_subdivision: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-anual/' + id_subdivision + '/' + anio);
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
