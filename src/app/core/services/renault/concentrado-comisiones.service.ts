import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcentradoComisionesService {

   constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(environment.apiUrl+'renault/concentrado-comisiones');
  }
}
