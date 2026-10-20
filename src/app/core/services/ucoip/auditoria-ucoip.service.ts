import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaUcoipService {

  constructor(private http: HttpClient) { }

    public getAuditoriasUcoip(id:any): Observable<any> {
      return this.http.get(environment.apiUrl + 'ucoip/auditoria-ucoip/'+id);
    }

    public getAuditUcoip(id:any): Observable<any> {
      return this.http.get(`${environment.apiUrl}ucoip/auditoria-ucoip/${id}/allUcoip`);
    }

    public saveAuditoria(data: any): Observable<any> {
      return this.http.post<any>(environment.apiUrl + 'ucoip/auditoria-ucoip', data);
    }

    public downloadPDF(){

    }

    public printAuditoriaPDF(id: number) {
        return this.http.get(
          `${environment.apiUrl}ucoip/auditoria-ucoip/${id}/descargarpdf`,
          {
            responseType: 'blob',
            observe: 'response'
          }
        );
      }

}
