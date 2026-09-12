import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RespuestaGemini {
  status: 'success' | 'partial_success' | 'error';
  data: Record<string, any>;
  errors: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentosServiceService {

    constructor(private http: HttpClient) {}

      procesar(data: FormData): Observable<RespuestaGemini> {
      return this.http.post<RespuestaGemini>(environment.apiUrl+'documentacion-requerida/expediente/cloud', data);
    }
}
