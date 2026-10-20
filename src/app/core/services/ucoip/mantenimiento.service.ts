import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

    constructor(private http: HttpClient) { }

    public save(data: any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'ucoip/mantenimiento', data);
    }

    public obtenerPorId(id: any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'ucoip/mantenimiento/'+id);
    }


}
