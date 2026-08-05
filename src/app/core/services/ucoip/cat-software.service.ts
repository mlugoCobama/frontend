import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatSoftwareService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + 'ucoip/cat-software');
  }

  public save(data:any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + 'ucoip/cat-software', data);
  }


  public getLicenciasDiponiblesByTipo(id:any, tipo:any): Observable<any> {
          return this.http.get<any>(environment.apiUrl + 'ucoip/software/licencias/disponibles/'+id+'/'+tipo);
  }

    public destroy(id: any): Observable<any> {
      return this.http.delete(environment.apiUrl +'ucoip/cat-software/'+id);
    }

}
