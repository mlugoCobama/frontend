import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class AcuseRecibidoService {

  constructor(private http: HttpClient) { }

solicitarSurtido(data:any): Observable<any> {
    return this.http.post(environment.apiUrl +'compras/solictar-surtido-orden-compra', data);
  }

  guardarAcuse(formData: FormData): Observable<any> {
    return this.http.post(environment.apiUrl +'compras/AcuseEntrega', formData);
  }

}
