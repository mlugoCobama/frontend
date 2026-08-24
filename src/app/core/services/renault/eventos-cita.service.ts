import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosCitaService {

  constructor(private http: HttpClient) { }


    public save(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + 'renault/eventos-citas', data);
    }

    public edit(id:number, data:any): Observable<any> {
      return this.http.put(environment.apiUrl + `renault/eventos-citas/${id}`, data);
    }

}
