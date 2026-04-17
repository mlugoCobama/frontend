import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcentradoComisionesService {

   constructor(private http: HttpClient) {}

  getAll(agencia:any) {
    return this.http.get(environment.apiUrl+'renault/concentrado-comisiones/'+agencia);
  }

  getDetalleRubro(idVendedor: any, rubro: any) {
    return this.http.get(`${environment.apiUrl}renault/concentrado-comisiones/detalle/${idVendedor}/${rubro}`);
  }

  public devolverPartida(id ,data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `renault/concentrado-comisiones/devolver/${id}`, data);
  }

  public autorizarPartida(id ,data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `renault/concentrado-comisiones/autorizado/${id}`, data);
  }

  crearCorte(data) {
      return this.http.post(environment.apiUrl+'renault/concentrado-comisiones', data);
    }

  getCortesByAgencia(agenciaId: number) {
    return this.http.get<any>(`${environment.apiUrl}renault/concentrado-comisiones/listado/cortes/${agenciaId}`);
  }

  getDetalleCorte(corteId: number) {
    return this.http.get<any>(`${environment.apiUrl}renault/concentrado-comisiones/corte/${corteId}`);
  }
}
