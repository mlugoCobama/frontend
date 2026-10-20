import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsingRecursoUcoipService {

  constructor(private http: HttpClient) { }

    public getUcoipResguardos(id:any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'ucoip/recurso-ucoip/'+id);
  }

  public save(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'ucoip/recurso-ucoip', data);
  }


  public remove(id: any): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + 'ucoip/recurso-ucoip/' + id);
  }

}
