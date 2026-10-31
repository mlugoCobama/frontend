import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'capacitaciones/puestos');
  }

  public getPermisos(id:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'capacitaciones/puestos/'+id);
  }

  public getPuestoModulos(id:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + `capacitaciones/puestos/${id}/edit`);
  }

  public save(data:any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'capacitaciones/puestos', data);
  }

  public destroy( id : number): Observable<any> {
      return this.http.delete(environment.apiUrl + `capacitaciones/puestos/${id}`);
    }

  public edit(id:number, data:any): Observable<any> {
    return this.http.put(environment.apiUrl + `capacitaciones/puestos/${id}`, data);
  }


}
