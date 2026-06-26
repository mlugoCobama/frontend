import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UcoipService {

  constructor(private http: HttpClient) { }


  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/ucoip');
  }

  public getOne(id:any): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/ucoip/'+id);
  }

  public save(data: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + 'ucoip/ucoip', data);
      }

  public getPasswordUcoip(id:any): Observable<any> {
        return this.http.get<any>(environment.apiUrl + 'ucoip/ucoip/password/'+id);
      }
}
