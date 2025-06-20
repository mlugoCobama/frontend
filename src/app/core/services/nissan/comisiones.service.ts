import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseComision } from '../../models/nissan/comisiones';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  constructor(private http: HttpClient) { }
  
    public getAll(): Observable<ResponseComision> {
      return this.http.get<ResponseComision>(environment.apiUrl + 'nissan/comisiones');
    }
}
