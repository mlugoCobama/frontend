import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResguardosService {

   constructor(private http: HttpClient) { }


  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/ucoip');
  }

  
  public getUcoipResguardos(id:any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'ucoip/resguardos/'+id);
  }

  public save(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'ucoip/resguardos', data);
  }


  public remove(id: any): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + 'ucoip/resguardos/' + id);
  }

  // public print(id: any, data:any): Observable<any> {
  //   return this.http.put<any>(environment.apiUrl + 'ucoip/resguardos/' + id, data,
  //   {
  //     responseType: 'blob'
  //   });
  // }

  print(id: number, payload: any) {
    return this.http.put(
    environment.apiUrl + `ucoip/resguardos/${id}`, payload,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
}
