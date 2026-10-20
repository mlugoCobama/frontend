import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisorVolumetricosService {
  constructor(private http: HttpClient) { }

  public getAll(): Observable<any> {
    return this.http.get(environment.apiUrl + 'volumetricos/volumetricos');
  }

  public getOne(id): Observable<any> {
    return this.http.get(environment.apiUrl + 'volumetricos/volumetricos/'+id);
  }

  public store(data): Observable<any> {
    return this.http.post(environment.apiUrl + 'volumetricos/volumetricos',data);
  }

  public storeAcuse(data): Observable<any> {
    return this.http.post(environment.apiUrl + 'volumetricos/acuses',data);
  }

  public parse(data): Observable<any> {
    return this.http.post(environment.apiUrl + 'volumetricos/generacion',data, {observe: 'response'});
  }

  public update(id, data): Observable<any> {
    return this.http.post(environment.apiUrl + 'volumetricos/volumetricos/'+id,data);
  }


  public delete(id:any): Observable<any> {
    return this.http.delete(environment.apiUrl + 'volumetricos/volumetricos/'+id);
  }
}
