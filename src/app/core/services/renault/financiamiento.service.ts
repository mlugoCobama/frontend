import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FinanciamientoService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(environment.apiUrl+'renault/financiamiento');
  }

  getDataVenta(factura:any) {
    return this.http.get(environment.apiUrl+'renault/financiamiento/datos-venta/'+factura);
  }  

  public getLibroVentas(estado:any ,agencia: any, fecha_inicio:any, fecha_fin:any, vendedor:any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + `renault/financiamiento/${estado}/${agencia}/${fecha_inicio}/${fecha_fin}/${vendedor}`);
  }

  public devolverPartida(id ,data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `renault/financiamiento/${id}`, data);
  }

  avanzarEstado(id: number) {
    return this.http.get(`${environment.apiUrl}renault/financiamiento/avanzarEstatus/${id}`);
  }
 

  create(data: FormData) {
    return this.http.post(environment.apiUrl+'renault/financiamiento', data);
  }

  update(id: number, data: FormData) {
    return this.http.post(`${environment.apiUrl}renault/financiamiento/${id}?_method=PUT`, data);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}renault/financiamiento/${id}`);
  }

   obtenerArchivo(id: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}renault/financiamiento/archivo/${id}`, {
      responseType: 'blob' 
    });
  }


}
