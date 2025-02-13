import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import {catEstados} from 'src/environments/cat_estados.json';



@Injectable({
  providedIn: 'root'
})
export class CatEstadosService {
  private jsonUrl= './assets/cat_estados.json';

  constructor(private http: HttpClient) {}
   getData(): Observable<any> {
    return this.http.get(this.jsonUrl);}
}
