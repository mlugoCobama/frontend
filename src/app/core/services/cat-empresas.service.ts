import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseCatEmpresas } from '../models/cat-empresas';

@Injectable({
  providedIn: 'root'
})
export class CatEmpresasService {

  constructor(
    private http: HttpClient,
  ) {}

  public getAll(subdivision: number) : Observable<ResponseCatEmpresas> {
    return this.http.get<ResponseCatEmpresas>(environment.apiUrl + 'cat-empresas/' + subdivision);
  }
}
