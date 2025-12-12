import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerjetaClienteService {
 constructor(private http: HttpClient) {}

  saveTarjetaCliente(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'cpp/tarjetaclientes' , data);
  }

  getTarjetaCliente(): Observable<any> {
    return this.http.get(`${environment.apiUrl}cpp/tarjetaclientes`);
  }
}
