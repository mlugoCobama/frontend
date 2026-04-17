import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TomaUnidadesService {

   constructor(private http: HttpClient) {}

    getAll() {
      return this.http.get(environment.apiUrl+'renault/toma-unidad');
    }

    getDataVenta(inventario:any) {
      return this.http.get(environment.apiUrl+'renault/toma-unidad/datos-venta/'+inventario);
    }  

    public getLibroVentas(estado:any ,agencia: any, fecha_inicio:any, fecha_fin:any, vendedor:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + `renault/toma-unidad/${estado}/${agencia}/${fecha_inicio}/${fecha_fin}/${vendedor}`);
    }

    public devolverPartida(id ,data:any): Observable<any> {
        return this.http.put(environment.apiUrl + `renault/toma-unidad/${id}`, data);
    }

    avanzarEstado(id: number) {
      return this.http.get(`${environment.apiUrl}renault/toma-unidad/avanzarEstatus/${id}`);
    }
  

    create(data: FormData) {
      return this.http.post(environment.apiUrl+'renault/toma-unidad', data);
    }

    update(id: number, data: FormData) {
      return this.http.post(`${environment.apiUrl}renault/toma-unidad/${id}?_method=PUT`, data);
    }

    delete(id: number) {
      return this.http.delete(`${environment.apiUrl}renault/toma-unidad/${id}`);
    }
}
