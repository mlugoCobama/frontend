import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ResponseAgenciasNissan} from "../../models/dashboard/agencias-nissan";
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
     */
    public getAgencias(mes: number, anio: number) : Observable<any> {
      return this.http.get(environment.apiUrl + 'agencia-nissan/' + mes + '/' + anio);
    }

    /**
     * Guarda datos de las agencias Nissan.
     * \captura-agencias\captura-agencias.component.ts.
     * @param data datos obtenidos de tabla datos.
     */
    public save(data: any): Observable<any> {
      return this.http.post(environment.apiUrl + "dashboard/agencia-nissan", data);
    }

    /**
     * Actualiza datos de las agencias Nissan.
     * \captura-agencias\captura-agencias.component.ts.
     * @param data datos obtenidos de tabla datos.
     */
    public update(data: any): Observable<any> {
      return this.http.put(environment.apiUrl + "dashboard/edit-agencia-nissan", data);
    }


    /**
     * Botones
     * Ejecuta una función que esta en otro componente
     */
    private guardarDatosNissanSubject = new Subject<void>();
    guardarDatosNissan$ = this.guardarDatosNissanSubject.asObservable();
    triggerGuardarDatosNissan() {
      this.guardarDatosNissanSubject.next();
    }  

    /**
     * Consulta el mes 
     * \captura-agencias\forms\tabla-mes-agencia\tabla-mes-agencia.component.ts
     * @param mes mes de consulta
     * @param anio
     * @returns array formateado 
     */
    public getMesAgencias(mes: number, anio: number) : Observable<any> {
      return this.http.get(environment.apiUrl + 'show-agencia-nissan/' + mes + '/' + anio);
    }

    /**
     * Devuelve los datos de mes y mesAnt nissan
     * @returns Data anual de agencias nissan
     */
    public getAnual(): Observable<ResponseAgenciasNissan> {
        return this.http.get<ResponseAgenciasNissan>(environment.apiUrl +"dashboard/agencia-nissan/3/4/2025");
    }
}
