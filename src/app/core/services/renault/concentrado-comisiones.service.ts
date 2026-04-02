import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcentradoComisionesService {

   constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(environment.apiUrl+'renault/concentrado-comisiones');
  }

  getDetalleRubro(idVendedor: any, rubro: any) {
    return this.http.get(`${environment.apiUrl}renault/concentrado-comisiones/detalle/${idVendedor}/${rubro}`);
  }

  public devolverPartida(id ,data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `renault/concentrado-comisiones/devolver/${id}`, data);
  }

  crearCorte(data) {
      return this.http.post(environment.apiUrl+'renault/concentrado-comisiones', data);
    }
}
