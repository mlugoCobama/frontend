import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});


@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }
  /**
   * Recupera todos los datos de biometricos
   * @returns colección de datos de biometricos
   */
  public getEmpleados(intercompania: number): Observable<any> {
    return this.http.get(environment.apiBiometricosUrl + 'v1/companies/' + intercompania + '/employees', {headers});
  } 
  /**
   * Recupera todos los datos de biometricos
   * @returns colección de datos de biometricos
   */
  public postEmpleados(data: any): Observable<any> {
    return this.http.post(environment.apiBiometricosUrl + 'v1/employees/batch', data ,{headers});
  } 

  public update(data: any, id: number): Observable<any> {
    return this.http.put(environment.apiBiometricosUrl + 'v1/employees/' + id, data ,{headers});
  } 

  public delete(data: any): Observable<any> {
    return this.http.delete(environment.apiBiometricosUrl + 'v1/employees/' + data ,{headers});
  } 

  public enrollFingerprint(id: number, data: any): Observable<any> {
    return this.http.post(environment.apiBiometricosUrl + 'v1/employees/' + id +  '/enroll-fingerprint', data ,{headers});
  } 


}
