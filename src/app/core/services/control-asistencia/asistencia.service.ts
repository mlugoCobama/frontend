import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  constructor(private http: HttpClient) { }

  /**
   * Recupera todos los datos de biometricos
   * @returns colección de datos de biometricos
   */
  public getAll(company_id: number): Observable<any> {
    return this.http.get(environment.apiBiometricosUrl + 'v1/companies/intercompania/' + company_id + '/reports/daily');
  }
   /**
   * Recupera todos los datos de biometricos de una fecha
   * @returns colección de datos de biometricos
   */
  public getDate(company_id: number, date: any): Observable<any> {
    return this.http.get(environment.apiBiometricosUrl + 'v1/companies/intercompania/' + company_id + '/reports/daily?date=' + date);
  }

  /**
   * Descarga de CSV de reporte por quincena
   * @returns colección de datos de biometricos
   */
  public getReporteQuincenal(company_id: number, date: any): Observable<any> {
    return this.http.get(environment.apiBiometricosUrl + 'v1/companies/intercompania/' + company_id + '/reports/quincenal/csv?period=' + date);
  }
}
