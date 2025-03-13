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
<<<<<<< HEAD
   * Funcion para consultar informacion mensual de gaseras
   * MODULO Dashboard/Captura/Captura Gaseras
   * @param mes integer
   * @param anio integer
=======
    * Recupera los datos del mes gaseras
   * @param mes 
   * @param anio 
   * @returns 
>>>>>>> ac3d6ea0ba6cc26594ff47aeb3ccb27f2cbeb88d
   */
  public get(mes: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-gaseras/' + mes + '/' + anio);
  }
  /**
   * Función para obtener los datos anuales de la division de energeticos o gasolinerias
   * MODULO Dashboard/Landing Page/Energeticos
   * 1 = gaseras
   * 2 = gasolinerias
   * @param id_subdivision integer
   */
  public getAnual(id_subdivision: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos/' + id_subdivision);
  }
  
  public getAnualSubDivision(id_subdivision: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-anual/' + id_subdivision + '/' + anio);
  }
  
<<<<<<< HEAD
  public getGasolinerias(mes: number, anio: number) : Observable<ResponseEnergeticosGaseras> {
    return this.http.get<ResponseEnergeticosGaseras>(environment.apiUrl + 'energeticos-gasolineras/' + mes + '/' + anio);
  }
  /**
   * 
   * @param data 
   * @returns 
   */
=======
      /**
     * Crea o actualiza registros en 'datos_generales'
     * @param data 
     * @returns 
     */
>>>>>>> ac3d6ea0ba6cc26594ff47aeb3ccb27f2cbeb88d
  public save(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + "dashboard/gasolinerias", data);
  }
}
