import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsingTokensUcoipService {

   constructor(private http: HttpClient) { }
  
    public getUcoipTokens(id:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'ucoip/tokens-ucoip/'+id);
    }

    public getTokensDisponibles(idSucursal:any): Observable<any> {
      return this.http.get<any>(environment.apiUrl + 'ucoip/tokens-agencias/'+idSucursal);
    }
  
    public save(data: any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'ucoip/tokens-ucoip', data);
    }
  
  
    public remove(id: any): Observable<any> {
      return this.http.delete<any>(environment.apiUrl + 'ucoip/tokens-ucoip/' + id);
    }
  
    public getPasswordUcoip(id:any, tipo:string): Observable<any> {
          return this.http.get<any>(environment.apiUrl + 'ucoip/tokens-ucoip/password/'+id+'/'+tipo);
    }
  
}
