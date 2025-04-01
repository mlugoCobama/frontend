import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreasDepartamentosService {

  constructor(private http: HttpClient) { }


  public getAreas(): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/areas');
  }

  public getAreasDeptos(areaId: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/areas-deptos/' + areaId);
  }

  public getDeptoPuestos(deptoId: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'ucoip/departamentos-puestos/' + deptoId);
  }
}
