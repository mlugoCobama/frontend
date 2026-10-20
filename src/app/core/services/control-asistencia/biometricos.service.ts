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
export class BiometricosService {

  constructor(private http: HttpClient) { }

    /**
     * Recupera todos los datos de biometricos
     * @returns colección de datos de biometricos
     */
    public getAll(): Observable<any> {
      return this.http.get(environment.apiBiometricosUrl + 'v1/devices', {headers});
    } 
}
