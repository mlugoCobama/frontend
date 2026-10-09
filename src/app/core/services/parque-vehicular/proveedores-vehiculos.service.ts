import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface FiltrosOrdenServicio {
  fecha_inicio?: string;
  fecha_fin?: string;
  intercompania?: string | number;
  com_proveedores_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresVehiculosService {

  constructor(private http: HttpClient) {}


  public store(data:any): Observable<any> {
    return this.http.post(environment.apiUrl + 'parque-vehicular/vehiculos-proveedores',data);
  }

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'parque-vehicular/vehiculos-proveedores');
  }

  public update(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + 'parque-vehicular/vehiculos-proveedores/'+id,data);
  }

  getOrdenesServicio(filtros?: FiltrosOrdenServicio): Observable<any> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach((key) => {
        const valor = filtros[key as keyof FiltrosOrdenServicio];
        // Solo agregamos el parámetro si tiene un valor asignado
        if (valor !== null && valor !== undefined && valor !== '') {
          params = params.set(key, valor.toString());
        }
      });
    }

    return this.http.get<any>(environment.apiUrl + 'parque-vehicular/vehiculos-proveedores', { params });
  }
}
